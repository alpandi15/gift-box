import { browser } from '$app/environment';
import { get, writable } from 'svelte/store';

const MUSIC_SOURCE = '/assets/musics/music.mp3';
const MUSIC_STORAGE_KEY = 'birthdayGiftHuntMusic';
const DEFAULT_VOLUME = 0.45;

type StoredMusicState = {
	enabled?: boolean;
	hasInteracted?: boolean;
	volume?: number;
	isMuted?: boolean;
};

export type MusicState = {
	isPlaying: boolean;
	isReady: boolean;
	isMuted: boolean;
	hasInteracted: boolean;
	error?: string;
};

const initialState: MusicState = {
	isPlaying: false,
	isReady: false,
	isMuted: false,
	hasInteracted: false
};

export const musicState = writable<MusicState>(initialState);

let audio: HTMLAudioElement | null = null;

function normalizeVolume(value: number) {
	return Math.min(1, Math.max(0, value));
}

function readStoredMusicState(): StoredMusicState {
	if (!browser) return {};

	try {
		const rawValue = window.localStorage.getItem(MUSIC_STORAGE_KEY);
		return rawValue ? (JSON.parse(rawValue) as StoredMusicState) : {};
	} catch {
		return {};
	}
}

function writeStoredMusicState(nextState: StoredMusicState) {
	if (!browser) return;

	try {
		const currentState = readStoredMusicState();
		window.localStorage.setItem(
			MUSIC_STORAGE_KEY,
			JSON.stringify({ ...currentState, ...nextState })
		);
	} catch {
		// Storage is optional; audio controls should keep working without it.
	}
}

function syncFromAudio() {
	const audioElement = audio;
	if (!audioElement) return;

	musicState.update((state) => ({
		...state,
		isPlaying: !audioElement.paused,
		isMuted: audioElement.muted,
		isReady: state.isReady || audioElement.readyState >= HTMLMediaElement.HAVE_METADATA
	}));
}

export function initMusic() {
	if (!browser) return null;
	if (audio) return audio;

	const storedState = readStoredMusicState();
	const audioElement = new Audio(MUSIC_SOURCE);

	audioElement.loop = true;
	audioElement.preload = 'auto';
	audioElement.volume = normalizeVolume(storedState.volume ?? DEFAULT_VOLUME);
	audioElement.muted = Boolean(storedState.isMuted);

	audioElement.addEventListener('loadedmetadata', () => {
		musicState.update((state) => ({ ...state, isReady: true, error: undefined }));
	});

	audioElement.addEventListener('canplaythrough', () => {
		musicState.update((state) => ({ ...state, isReady: true, error: undefined }));
	});

	audioElement.addEventListener('play', syncFromAudio);
	audioElement.addEventListener('pause', syncFromAudio);

	audioElement.addEventListener('error', () => {
		musicState.update((state) => ({
			...state,
			isPlaying: false,
			error: 'Musik belum bisa diputar.'
		}));
	});

	audio = audioElement;

	musicState.set({
		isPlaying: false,
		isReady: audioElement.readyState >= HTMLMediaElement.HAVE_METADATA,
		isMuted: audioElement.muted,
		hasInteracted: Boolean(storedState.hasInteracted),
		error: undefined
	});

	return audio;
}

export async function playMusic() {
	const audioElement = initMusic();
	if (!audioElement) return false;

	musicState.update((state) => ({
		...state,
		hasInteracted: true,
		error: undefined
	}));
	writeStoredMusicState({ enabled: true, hasInteracted: true });

	try {
		await audioElement.play();
		syncFromAudio();
		return true;
	} catch {
		musicState.update((state) => ({
			...state,
			isPlaying: false,
			error: undefined
		}));
		return false;
	}
}

export function pauseMusic() {
	const audioElement = initMusic();
	if (!audioElement) return;

	audioElement.pause();
	musicState.update((state) => ({
		...state,
		isPlaying: false,
		hasInteracted: true
	}));
	writeStoredMusicState({ enabled: false, hasInteracted: true });
}

export async function toggleMusic() {
	const state = get(musicState);

	if (state.isPlaying) {
		pauseMusic();
		return false;
	}

	return playMusic();
}

export function stopMusic() {
	const audioElement = initMusic();
	if (!audioElement) return;

	audioElement.pause();
	audioElement.currentTime = 0;
	musicState.update((state) => ({
		...state,
		isPlaying: false,
		hasInteracted: true
	}));
	writeStoredMusicState({ enabled: false, hasInteracted: true });
}

export function setVolume(value: number) {
	const audioElement = initMusic();
	const volume = normalizeVolume(value);

	if (audioElement) {
		audioElement.volume = volume;
	}

	writeStoredMusicState({ volume });
}
