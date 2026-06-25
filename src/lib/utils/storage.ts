import { giftStepIds, isGiftStepId, type GiftStepId } from '$lib/data/giftSteps';

export const HUNT_STORAGE_KEY = 'birthdayGiftHunt';

export interface HuntState {
	started: boolean;
	currentStep: GiftStepId;
	foundSteps: GiftStepId[];
	finalUnlocked: boolean;
	completed: boolean;
}

export const initialHuntState: HuntState = {
	started: false,
	currentStep: giftStepIds[0],
	foundSteps: [],
	finalUnlocked: false,
	completed: false
};

type HuntStateUpdater = Partial<HuntState> | ((state: HuntState) => HuntState);

function createInitialState(): HuntState {
	return {
		...initialHuntState,
		foundSteps: []
	};
}

function normalizeHuntState(value: unknown): HuntState {
	if (!value || typeof value !== 'object') {
		return createInitialState();
	}

	const candidate = value as Partial<HuntState>;
	const currentStep =
		typeof candidate.currentStep === 'number' && isGiftStepId(candidate.currentStep)
			? candidate.currentStep
			: initialHuntState.currentStep;
	const foundSteps = Array.isArray(candidate.foundSteps)
		? [...new Set(candidate.foundSteps.filter((step): step is GiftStepId => isGiftStepId(step)))]
		: [];

	return {
		started: candidate.started === true,
		currentStep,
		foundSteps,
		finalUnlocked: candidate.finalUnlocked === true,
		completed: candidate.completed === true
	};
}

function canUseLocalStorage(): boolean {
	return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function getHuntState(): HuntState {
	if (!canUseLocalStorage()) {
		return createInitialState();
	}

	try {
		const storedState = window.localStorage.getItem(HUNT_STORAGE_KEY);
		return storedState ? normalizeHuntState(JSON.parse(storedState)) : createInitialState();
	} catch {
		return createInitialState();
	}
}

export function setHuntState(state: HuntState): HuntState {
	const normalizedState = normalizeHuntState(state);

	if (canUseLocalStorage()) {
		try {
			window.localStorage.setItem(HUNT_STORAGE_KEY, JSON.stringify(normalizedState));
		} catch {}
	}

	return normalizedState;
}

export function updateHuntState(updater: HuntStateUpdater): HuntState {
	const currentState = getHuntState();
	const nextState =
		typeof updater === 'function' ? updater(currentState) : { ...currentState, ...updater };

	return setHuntState(nextState);
}

export function resetHuntState(): HuntState {
	if (canUseLocalStorage()) {
		try {
			window.localStorage.removeItem(HUNT_STORAGE_KEY);
		} catch {}
	}

	return createInitialState();
}
