<script lang="ts">
	import { page } from '$app/state';
	import { AppShell, GuardNotice, MessageCard, PaperCard, UnlockCard } from '$lib';
	import { getGiftStep, isGiftStepId, type GiftStep } from '$lib/data/giftSteps';
	import { canOpenGiftStep } from '$lib/utils/stepGuard';
	import { getHuntState, updateHuntState } from '$lib/utils/storage';
	import { onMount } from 'svelte';

	type ViewState = 'loading' | 'allowed' | 'guarded';

	let viewState = $state<ViewState>('loading');
	let giftStep = $state<GiftStep | null>(null);

	onMount(() => {
		const parsedStep = Number(page.params.step);

		if (!Number.isInteger(parsedStep) || !isGiftStepId(parsedStep)) {
			viewState = 'guarded';
			return;
		}

		const state = getHuntState();
		const wasAlreadyFound = state.foundSteps.includes(parsedStep);

		if (!wasAlreadyFound && !canOpenGiftStep(parsedStep, state)) {
			viewState = 'guarded';
			return;
		}

		giftStep = getGiftStep(parsedStep);

		if (!wasAlreadyFound) {
			updateHuntState((currentState) => ({
				...currentState,
				currentStep: giftStep?.nextStep ?? currentState.currentStep,
				foundSteps: [...new Set([...currentState.foundSteps, parsedStep])],
				finalUnlocked: currentState.finalUnlocked || giftStep?.isFinalTrigger === true
			}));
		}

		viewState = 'allowed';
	});
</script>

<AppShell title="Sebuah Pesan Terbuka" background="paper">
	<div class="flex min-h-[calc(100dvh-3rem)] items-center py-5">
		{#if viewState === 'loading'}
			<PaperCard class="w-full">
				<div class="py-8 text-center" aria-live="polite">
					<img
						class="mx-auto size-9 animate-pulse"
						src="/assets/icons/envelope.svg"
						alt=""
						aria-hidden="true"
					/>
					<p class="mt-3 text-sm font-semibold text-muted">Membuka pesan untukmu...</p>
				</div>
			</PaperCard>
		{:else if viewState === 'guarded' || !giftStep}
			<div class="w-full">
				<GuardNotice
					message="Balik dulu ke petunjuk yang sedang terbuka ya. Kejutannya akan terasa lebih manis kalau ditemukan berurutan."
				/>
			</div>
		{:else}
			<div class="w-full space-y-5">
				<MessageCard
					title="Kamu menemukan sesuatu ❤️"
					message={giftStep.message}
					illustration="/assets/illustrations/envelope-heart.webp"
					note="Simpan pesan ini baik-baik, lalu lanjutkan saat kamu siap."
				/>

				<UnlockCard
					title={giftStep.isFinalTrigger
						? 'Satu petunjuk terakhir terbuka ✨'
						: 'Petunjuk baru terbuka ✨'}
					message={giftStep.isFinalTrigger
						? 'Ada sesuatu yang istimewa menunggumu.'
						: 'Baca pelan-pelan, lalu lanjutkan misinya.'}
					href={giftStep.isFinalTrigger ? '/final' : '/clue'}
					ctaLabel={giftStep.isFinalTrigger
						? 'Buka Petunjuk Terakhir'
						: 'Buka Petunjuk Berikutnya'}
				/>
			</div>
		{/if}
	</div>
</AppShell>
