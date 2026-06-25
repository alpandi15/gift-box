import {
	getGiftStepByQrToken,
	getGiftStep,
	giftStepIds,
	isGiftStepId,
	type GiftStep,
	type GiftStepId
} from '$lib/data/giftSteps';
import { getHuntState, type HuntState } from '$lib/utils/storage';

export type QrTokenValidation =
	| { valid: true; step: GiftStep }
	| { valid: false; reason: 'not-started' | 'unknown-token' | 'already-found' | 'wrong-step' };

function hasFoundEveryPreviousStep(stepId: GiftStepId, state: HuntState): boolean {
	return giftStepIds
		.filter((candidateStepId) => candidateStepId < stepId)
		.every((candidateStepId) => state.foundSteps.includes(candidateStepId));
}

export function validateQrToken(
	qrToken: string,
	state: HuntState = getHuntState()
): QrTokenValidation {
	if (!state.started) {
		return { valid: false, reason: 'not-started' };
	}

	const step = getGiftStepByQrToken(qrToken);

	if (!step) {
		return { valid: false, reason: 'unknown-token' };
	}

	if (state.foundSteps.includes(step.id)) {
		return { valid: false, reason: 'already-found' };
	}

	if (state.currentStep !== step.id || !hasFoundEveryPreviousStep(step.id, state)) {
		return { valid: false, reason: 'wrong-step' };
	}

	return { valid: true, step };
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

export function getLastUnlockedMessageStep(state: HuntState = getHuntState()): GiftStep | null {
	if (
		!state.started ||
		!isGiftStepId(state.lastUnlockedMessageStep) ||
		!state.foundSteps.includes(state.lastUnlockedMessageStep)
	) {
		return null;
	}

	return getGiftStep(state.lastUnlockedMessageStep);
}
