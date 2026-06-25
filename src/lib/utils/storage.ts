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

function getSequentialFoundSteps(value: unknown): GiftStepId[] {
	if (!Array.isArray(value)) {
		return [];
	}

	const validSteps = new Set(value.filter((step): step is GiftStepId => isGiftStepId(step)));
	const sequentialSteps: GiftStepId[] = [];

	for (const stepId of giftStepIds) {
		if (!validSteps.has(stepId)) break;
		sequentialSteps.push(stepId);
	}

	return sequentialSteps;
}

export function normalizeHuntState(value: unknown): HuntState {
	if (!value || typeof value !== 'object') {
		return createInitialState();
	}

	const candidate = value as Partial<HuntState>;
	const started = candidate.started === true;

	if (!started) {
		return createInitialState();
	}

	const foundSteps = getSequentialFoundSteps(candidate.foundSteps);
	const nextStep = giftStepIds.find((stepId) => !foundSteps.includes(stepId));
	const allGiftStepsFound = nextStep === undefined;
	const currentStep = nextStep ?? giftStepIds[giftStepIds.length - 1];
	const finalUnlocked = allGiftStepsFound;

	return {
		started,
		currentStep,
		foundSteps,
		finalUnlocked,
		completed: allGiftStepsFound && candidate.completed === true
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
