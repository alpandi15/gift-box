<script lang="ts">
	import { goto } from '$app/navigation';
	import { AppShell, Button, GuardNotice, MessageCard, PaperCard } from '$lib';
	import { canOpenFinal } from '$lib/utils/stepGuard';
	import { getHuntState, resetHuntState, updateHuntState } from '$lib/utils/storage';
	import { onMount } from 'svelte';

	type ViewState = 'loading' | 'allowed' | 'guarded';

	let viewState = $state<ViewState>('loading');
	let isResetting = $state(false);

	onMount(() => {
		const state = getHuntState();

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

<AppShell title="Selamat Ulang Tahun, Sayang" background="final">
	<div class="flex min-h-[calc(100dvh-3rem)] items-center py-5">
		{#if viewState === 'loading'}
			<PaperCard class="w-full">
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
					actionHref="/clue"
				/>
			</div>
		{:else}
			<div class="w-full space-y-5">
				<MessageCard
					title="Selamat ulang tahun, sayang ❤️"
					message="Semoga hari ini kamu merasa dicintai, dihargai, dan disayangi. Terima kasih sudah jadi rumah paling nyaman untuk aku pulang. Ini bukan sekadar hadiah, tapi cara kecilku bilang bahwa kamu sangat berarti."
					illustration="/assets/illustrations/final-big-gift.webp"
					note="Dengan seluruh cinta yang selalu memilihmu."
				/>

				<div class="rounded-lg bg-white/60 p-4 shadow-soft backdrop-blur-sm">
					<Button href="/" fullWidth size="lg">Selesai ❤️</Button>
					<div class="mt-2 text-center">
						<Button
							variant="ghost"
							size="sm"
							disabled={isResetting}
							onclick={resetMission}
						>
							{isResetting ? 'Mengulang misi...' : 'Reset Misi'}
						</Button>
					</div>
				</div>
			</div>
		{/if}
	</div>
</AppShell>
