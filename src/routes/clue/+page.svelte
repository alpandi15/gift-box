<script lang="ts">
	import { goto } from '$app/navigation';
	import { AppShell, Button, ClueCard, HeartsScatter, PaperCard, WifeCharacter } from '$lib';
	import type { GiftStep } from '$lib/data/giftSteps';
	import { canOpenFinal, getCurrentClueStep } from '$lib/utils/stepGuard';
	import { getHuntState } from '$lib/utils/storage';
	import { onMount } from 'svelte';

	let clueStep = $state<GiftStep | null>(null);
	let isReady = $state(false);

	onMount(async () => {
		const state = getHuntState();

		if (!state.started) {
			await goto('/', { replaceState: true });
			return;
		}

		if (canOpenFinal(state)) {
			await goto('/final', { replaceState: true });
			return;
		}

		clueStep = getCurrentClueStep(state);
		isReady = true;
	});
</script>

<AppShell title="Petunjuk Rahasia" background="paper" compact bottomSlot>
	{#snippet bottom()}
		{#if isReady && clueStep}
			<div class="bottom-panel text-center">
				<Button href="/scan" fullWidth>
					<img
						class="size-5 brightness-0 invert"
						src="/assets/icons/qr.svg"
						alt=""
						aria-hidden="true"
					/>
					Scan QR yang Kamu Temukan
				</Button>
				<p class="mt-2 text-xs leading-5 text-muted">
					Kalau sudah sampai di tempatnya, buka kamera dari sini.
				</p>
			</div>
		{/if}
	{/snippet}

	<div class="page-enter relative flex h-full min-h-0 items-center">
		{#if isReady && clueStep}
			<HeartsScatter density="low" />
		{/if}
		{#if !isReady || !clueStep}
			<PaperCard compact class="w-full">
				<div class="py-8 text-center" aria-live="polite">
					<img
						class="mx-auto size-9 animate-pulse"
						src="/assets/icons/sparkle.svg"
						alt=""
						aria-hidden="true"
					/>
					<p class="mt-3 text-sm font-semibold text-muted">Menyiapkan petunjukmu...</p>
				</div>
			</PaperCard>
		{:else}
			<div class="max-h-full w-full">
				<ClueCard
					title={clueStep.title}
					clue={clueStep.clue}
					illustration={clueStep.illustration}
					illustrationAlt="Ilustrasi kecil yang membantu menunjukkan lokasi petunjuk"
					compact
				/>
			</div>
		{/if}

		{#if isReady && clueStep}
			<WifeCharacter side="right" width="9.5rem" />
		{/if}
	</div>
</AppShell>
