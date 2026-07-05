<script lang="ts">
	import { goto } from '$app/navigation';
	import { AppShell, Button, GuardNotice, HeartsScatter, MessageCard, PaperCard } from '$lib';
	import type { GiftStep } from '$lib/data/giftSteps';
	import { getLastUnlockedMessageStep } from '$lib/utils/stepGuard';
	import { getHuntState } from '$lib/utils/storage';
	import { onMount } from 'svelte';

	let messageStep = $state<GiftStep | null>(null);
	let isReady = $state(false);
	let guardHref = $state('/');
	let guardLabel = $state('Mulai dari Awal');

	onMount(async () => {
		const state = getHuntState();

		if (!state.started) {
			await goto('/', { replaceState: true });
			return;
		}

		guardHref = '/clue';
		guardLabel = 'Kembali ke Petunjuk';
		messageStep = getLastUnlockedMessageStep(state);
		isReady = true;
	});
</script>

<AppShell title="Sebuah Pesan Terbuka" background="paper" compact bottomSlot>
	{#snippet bottom()}
		{#if isReady && messageStep}
			<div class="bottom-panel">
				<Button
					href={messageStep.isFinalTrigger ? '/final' : '/clue'}
					fullWidth
					size="lg"
				>
					{messageStep.isFinalTrigger
						? '🎁 Ada Satu Hal Terakhir'
						: 'Buka Petunjuk Berikutnya'}
				</Button>
				<p class="mt-2 text-center text-xs leading-5 text-muted">
					{messageStep.isFinalTrigger
						? 'Satu kejutan kecil menunggu di akhir perjalanan.'
						: 'Baca pelan-pelan, lalu lanjutkan perjalanannya.'}
				</p>
			</div>
		{:else if isReady}
			<div class="bottom-panel">
				<Button href={guardHref} variant="secondary" fullWidth>{guardLabel}</Button>
			</div>
		{/if}
	{/snippet}

	<div class="page-enter relative flex h-full min-h-0 items-center">
		{#if isReady && messageStep}
			<HeartsScatter density="low" />
		{/if}
		{#if !isReady}
			<PaperCard compact class="w-full">
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
		{:else if !messageStep}
			<div class="w-full">
				<GuardNotice
					title="Pesannya masih terkunci 💌"
					message="Ikuti dulu petunjuk yang sedang terbuka, lalu scan QR-nya dari dalam web."
					actionHref={guardHref}
					actionLabel={guardLabel}
					showAction={false}
					compact
				/>
			</div>
		{:else}
			<div class="w-full">
				<MessageCard
					title="Ada pesan untukmu ❤️"
					message={messageStep.message}
					illustration="/assets/illustrations/envelope-heart.webp"
					illustrationAlt="Amplop kecil dengan hiasan hati"
					note="Sebuah pesan kecil terbuka untukmu. Simpan baik-baik, ya."
					compact
				/>
			</div>
		{/if}
	</div>
</AppShell>
