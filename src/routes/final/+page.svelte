<script lang="ts">
	import { goto } from '$app/navigation';
	import { AppShell, Button, GuardNotice, MessageCard, PaperCard } from '$lib';
	import { canOpenFinal } from '$lib/utils/stepGuard';
	import { getHuntState, resetHuntState, updateHuntState } from '$lib/utils/storage';
	import { onMount } from 'svelte';

	type ViewState = 'loading' | 'allowed' | 'guarded';

	let viewState = $state<ViewState>('loading');
	let isResetting = $state(false);
	let guardHref = $state('/');
	let guardLabel = $state('Kembali ke Awal');

	onMount(() => {
		const state = getHuntState();
		guardHref = state.started ? '/clue' : '/';
		guardLabel = state.started ? 'Kembali ke Petunjuk Saat Ini' : 'Mulai dari Awal';

		if (!canOpenFinal(state)) {
			viewState = 'guarded';
			return;
		}

		if (!state.completed) {
			updateHuntState({ completed: true });
		}

		viewState = 'allowed';
	});

	async function resetMission() {
		if (isResetting) return;

		isResetting = true;
		resetHuntState();
		await goto('/');
	}
</script>

<AppShell title="Selamat Ulang Tahun, Sayang" background="final" compact bottomSlot>
	{#snippet bottom()}
		{#if viewState === 'allowed'}
			<div class="bottom-panel">
				<Button href="/" fullWidth size="lg">Selesai ❤️</Button>
				<div class="mt-1 text-center">
					<Button
						variant="ghost"
						size="sm"
						disabled={isResetting}
						onclick={resetMission}
					>
						{isResetting ? 'Mengulang...' : 'Main ulang dari awal'}
					</Button>
				</div>
			</div>
		{:else if viewState === 'guarded'}
			<div class="bottom-panel">
				<Button href={guardHref} variant="secondary" fullWidth>{guardLabel}</Button>
			</div>
		{/if}
	{/snippet}

	<div class="page-enter flex h-full min-h-0 items-center">
		{#if viewState === 'loading'}
			<PaperCard compact class="w-full">
				<div class="py-8 text-center" aria-live="polite">
					<img
						class="mx-auto size-9 animate-pulse"
						src="/assets/icons/heart.svg"
						alt=""
						aria-hidden="true"
					/>
					<p class="mt-3 text-sm font-semibold text-muted">Menyiapkan kejutanmu...</p>
				</div>
			</PaperCard>
		{:else if viewState === 'guarded'}
			<div class="w-full">
				<GuardNotice
					title="Kejutannya masih terkunci 💌"
					message="Masih ada petunjuk yang menunggumu. Kembali dulu dan lanjutkan perjalanan kecil ini, ya."
					actionHref={guardHref}
					actionLabel={guardLabel}
					showAction={false}
					compact
				/>
			</div>
		{:else}
			<div class="w-full">
				<MessageCard
					title="Selamat ulang tahun, sayang ❤️"
					message="Semoga hari ini kamu merasa dicintai, dihargai, dan disayangi. Terima kasih sudah jadi rumah paling nyaman untuk aku pulang. Ini bukan sekadar hadiah, tapi cara kecilku bilang bahwa kamu sangat berarti."
					illustration="/assets/illustrations/final-big-gift.webp"
					illustrationAlt="Hadiah besar untuk kejutan ulang tahun"
					note="Dengan seluruh cinta yang selalu memilihmu."
					compact
				/>
			</div>
		{/if}
	</div>
</AppShell>
