import {
	getGiftStep,
	giftStepIds,
	isGiftStepId,
	type GiftStep,
	type GiftStepId
} from '$lib/data/giftSteps';
import { getHuntState, type HuntState } from '$lib/utils/storage';

function hasFoundEveryPreviousStep(stepId: GiftStepId, state: HuntState): boolean {
	return giftStepIds
		.filter((candidateStepId) => candidateStepId < stepId)
		.every((candidateStepId) => state.foundSteps.includes(candidateStepId));
}

export function canOpenGiftStep(step: number, state: HuntState = getHuntState()): boolean {
	if (!isGiftStepId(step) || !state.started || state.currentStep !== step) {
		return false;
	}

	return hasFoundEveryPreviousStep(step, state);
}

export function canOpenFinal(state: HuntState = getHuntState()): boolean {
	const allGiftStepsFound = giftStepIds.every((stepId) => state.foundSteps.includes(stepId));

	return state.started && state.finalUnlocked && allGiftStepsFound;
}

export function getCurrentClueStep(state: HuntState = getHuntState()): GiftStep | null {
	if (!state.started || !isGiftStepId(state.currentStep)) {
		return null;
	}

	return getGiftStep(state.currentStep);
}
