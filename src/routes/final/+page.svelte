<script lang="ts">
	import { goto } from '$app/navigation';
	import { AppShell, Button, GuardNotice, HeartsScatter, LetterCard, PaperCard, Polaroid } from '$lib';
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

	<div class="page-enter relative flex h-full min-h-0 items-center">
		{#if viewState === 'allowed'}
			<HeartsScatter />
		{/if}
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
			<div class="relative w-full">
				<div class="final-polaroid" aria-hidden="true">
					<Polaroid
						src="/assets/illustrations/couple-polaroid-placeholder.webp"
						width="6rem"
						tilt={7}
						tape="peach"
						caption="kita ❤️"
					/>
				</div>

				<LetterCard
					title="Untukmu, Sayang ❤️"
					message="Selamat ulang tahun, cintaku. Semoga hari ini kamu merasa dicintai, dihargai, dan disayangi. Terima kasih sudah jadi rumah paling nyaman untuk aku pulang. Semoga semua impianmu dimudahkan dan hari-harimu penuh kebahagiaan."
					signature="Dengan cinta, suamimu — Muhammad Al-Pandi"
					compact
				/>
			</div>
		{/if}
	</div>
</AppShell>

<style>
	.final-polaroid {
		position: absolute;
		top: -6.75rem;
		right: -0.25rem;
		z-index: 30;
		pointer-events: none;
	}

	@media (max-height: 760px) {
		.final-polaroid {
			display: none;
		}
	}
</style>
