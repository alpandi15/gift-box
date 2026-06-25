<script lang="ts">
	import { goto } from '$app/navigation';
	import { AppShell, GuardNotice, MessageCard, PaperCard, UnlockCard } from '$lib';
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

<AppShell title="Sebuah Pesan Terbuka" background="paper">
	<div class="page-enter flex min-h-[calc(100dvh-3rem)] items-center py-3 sm:py-5">
		{#if !isReady}
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
		{:else if !messageStep}
			<div class="w-full">
				<GuardNotice
					title="Pesannya masih terkunci 💌"
					message="Temukan hadiah dari petunjuk yang sedang terbuka, lalu scan QR-nya dari dalam web."
					actionHref={guardHref}
					actionLabel={guardLabel}
				/>
			</div>
		{:else}
			<div class="w-full space-y-5">
				<MessageCard
					title="Kamu menemukan sesuatu ❤️"
					message={messageStep.message}
					illustration="/assets/illustrations/envelope-heart.webp"
					illustrationAlt="Amplop kecil dengan hiasan hati"
					note="Sebuah pesan kecil terbuka untukmu. Simpan baik-baik, ya."
				/>

				<UnlockCard
					title={messageStep.isFinalTrigger
						? 'Satu kejutan terakhir menunggu ✨'
						: 'Petunjuk baru terbuka ✨'}
					message={messageStep.isFinalTrigger
						? 'Ada sesuatu yang istimewa menunggumu.'
						: 'Baca pelan-pelan, lalu lanjutkan misinya.'}
					href={messageStep.isFinalTrigger ? '/final' : '/clue'}
					ctaLabel={messageStep.isFinalTrigger
						? 'Lanjut ke Kejutan Terakhir'
						: 'Buka Petunjuk Berikutnya'}
				/>
			</div>
		{/if}
	</div>
</AppShell>
