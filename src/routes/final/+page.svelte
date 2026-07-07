<script lang="ts">
	import { goto } from '$app/navigation';
	import { AppShell, Button, GuardNotice, HeartsScatter, LetterCard, PaperCard, TapeLabel } from '$lib';
	import { canOpenFinal } from '$lib/utils/stepGuard';
	import { getHuntState, resetHuntState, updateHuntState } from '$lib/utils/storage';
	import { onMount } from 'svelte';

	type ViewState = 'loading' | 'allowed' | 'guarded';

	let viewState = $state<ViewState>('loading');
	let revealStep = $state(1);
	let showLetter = $state(false);
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
		{#if viewState === 'allowed' && !showLetter}
			<div class="bottom-panel">
				{#if revealStep === 1}
					<Button fullWidth size="lg" onclick={() => (revealStep = 2)}>Sudah Kutemukan ❤️</Button>
					<p class="mt-2 text-center text-xs leading-5 text-muted">
						Kalau sudah kamu temukan, masih ada satu lagi untukmu.
					</p>
				{:else}
					<Button fullWidth size="lg" onclick={() => (showLetter = true)}>Sudah Kutemukan ❤️</Button>
					<p class="mt-2 text-center text-xs leading-5 text-muted">
						Kalau keduanya sudah di tanganmu, buka pesan terakhir dariku.
					</p>
				{/if}
			</div>
		{:else if viewState === 'allowed'}
			<div class="bottom-panel">
				<Button href="/gallery" fullWidth size="lg">Lihat Kenangan Kita ❤️</Button>
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
					<p class="mt-3 text-sm font-semibold text-muted">Menyiapkan catatan terakhirmu...</p>
				</div>
			</PaperCard>
		{:else if viewState === 'guarded'}
			<div class="w-full">
				<GuardNotice
					title="Catatan terakhir masih terkunci 💌"
					message="Masih ada petunjuk yang menunggumu. Kembali dulu dan lanjutkan perjalanan kecil ini, ya."
					actionHref={guardHref}
					actionLabel={guardLabel}
					showAction={false}
					compact
				/>
			</div>
		{:else if !showLetter}
			<div class="relative w-full">
				<div class="final-gift soft-pulse mx-auto mb-3 max-w-52">
					<img
						class="aspect-square w-full object-contain"
						src="/assets/illustrations/final-big-gift.webp"
						alt="Ilustrasi kejutan untuk Ella Adelia"
					/>
				</div>

				{#if revealStep === 1}
					<PaperCard compact torn tilt={-1} class="w-full">
						<div class="text-center">
							<TapeLabel text="Ada Sesuatu Untukmu" color="peach" icon="/assets/icons/heart.svg" />

							<h2 class="font-script mt-3 text-3xl font-bold leading-tight text-brown">
								Satu Hal Lagi...
							</h2>

							<p class="font-body mx-auto mt-3 max-w-sm text-base leading-7 text-ink">
								Sebelum kamu membaca pesan terakhirku, coba lihat di bawah meja printer. Di
								sana ada sesuatu yang menunggumu. Ambil pelan-pelan, ya. ❤️
							</p>
						</div>
					</PaperCard>
				{:else}
					<PaperCard compact torn tilt={-1} class="w-full">
						<div class="text-center">
							<TapeLabel text="Masih Ada Lagi" color="purple" icon="/assets/icons/sparkle.svg" />

							<h2 class="font-script mt-3 text-3xl font-bold leading-tight text-brown">
								Satu Lagi, ya 🥰
							</h2>

							<p class="font-body mx-auto mt-3 max-w-sm text-base leading-7 text-ink">
								Ada satu lagi yang aku sembunyikan untukmu. Coba lihat di bawah sajadah, tepat
								di depan cermin. Ambil dulu, lalu kembali ke sini untuk pesan terakhirku. ❤️
							</p>
						</div>
					</PaperCard>
				{/if}
			</div>
		{:else}
			<div class="relative w-full">
				<div class="final-gift gentle-float mx-auto mb-3 max-w-44">
					<img
						class="aspect-square w-full object-contain"
						src="/assets/illustrations/final-big-gift.webp"
						alt="Kado ulang tahun untuk Ella Adelia"
					/>
				</div>

				<LetterCard
					title="Untukmu, Sayang ❤️"
					message="Selamat ulang tahun, cintaku. Semoga hari ini kamu merasa dicintai, dihargai, dan disayangi. Terima kasih sudah jadi rumah paling nyaman untuk aku pulang. Semoga semua impianmu dimudahkan dan hari-harimu penuh kebahagiaan. Dan seandainya aku boleh memilih di kehidupan mana pun, aku akan tetap memilihmu — lagi, dan lagi, dan lagi."
					signature="Dengan cinta, suamimu — Muhammad Al-Pandi"
					compact
				/>
			</div>
		{/if}
	</div>
</AppShell>

<style>
	.final-gift {
		width: 100%;
	}

	@media (max-height: 720px) {
		.final-gift {
			max-width: 8rem;
		}
	}

	@media (max-height: 600px) {
		.final-gift {
			display: none;
		}
	}
</style>
