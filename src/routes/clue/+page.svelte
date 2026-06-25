<script lang="ts">
	import { goto } from '$app/navigation';
	import { AppShell, Button, ClueCard, PaperCard } from '$lib';
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

<AppShell title="Petunjuk Rahasia" background="paper">
	<div class="page-enter flex min-h-[calc(100dvh-3rem)] items-center py-3 sm:py-5">
		{#if !isReady || !clueStep}
			<PaperCard class="w-full">
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
			<div class="w-full space-y-5">
				<ClueCard
					title={clueStep.title}
					clue={clueStep.clue}
					illustration={clueStep.illustration}
					illustrationAlt="Ilustrasi kecil yang membantu menunjukkan lokasi petunjuk"
				/>

				<div class="rounded-lg bg-white/55 p-4 text-center shadow-soft backdrop-blur-sm">
					<Button href="/scan" fullWidth>
						<img
							class="size-5 brightness-0 invert"
							src="/assets/icons/qr.svg"
							alt=""
							aria-hidden="true"
						/>
						Scan QR yang Kamu Temukan
					</Button>
					<p class="mt-3 text-sm leading-6 text-muted">
						Cari hadiah tersembunyinya, lalu kembali ke sini untuk membuka kamera.
					</p>
				</div>
			</div>
		{/if}
	</div>
</AppShell>
