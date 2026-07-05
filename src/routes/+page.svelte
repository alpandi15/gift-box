<script lang="ts">
	import { goto } from '$app/navigation';
	import { AppShell, Button, HeartsScatter, PaperCard, Polaroid, TapeLabel, WifeCharacter } from '$lib';
	import { giftStepIds } from '$lib/data/giftSteps';
	import { playMusic } from '$lib/stores/musicStore';
	import { getHuntState, resetHuntState, updateHuntState } from '$lib/utils/storage';
	import { onMount } from 'svelte';

	let hasStarted = $state(false);
	let isCompleted = $state(false);
	let isReady = $state(false);
	let isNavigating = $state(false);
	let isResetting = $state(false);
	let showCover = $state(true);
	let isOpeningCover = $state(false);

	onMount(() => {
		const state = getHuntState();
		hasStarted = state.started;
		isCompleted = state.completed;
		isReady = true;
	});

	async function openCover() {
		if (isOpeningCover) return;

		isOpeningCover = true;
		// User gesture — safe to start the music here.
		void playMusic();

		// Let the fade-out animation play before unmounting the cover.
		setTimeout(() => {
			showCover = false;
			isOpeningCover = false;
		}, 520);
	}

	async function startMission() {
		if (isNavigating) return;

		isNavigating = true;
		void playMusic();

		updateHuntState((state) => ({
			...state,
			started: true,
			currentStep: state.started ? state.currentStep : giftStepIds[0],
			foundSteps: state.foundSteps ?? []
		}));

		await goto('/clue');
	}

	function restartMission() {
		if (isResetting) return;

		isResetting = true;
		resetHuntState();
		hasStarted = false;
		isResetting = false;
	}
</script>

<AppShell title="Untuk Ella Adelia ❤️" background="warm" compact bottomSlot>
	{#snippet bottom()}
		<div class="bottom-panel">
			{#if isCompleted}
				<Button href="/messages" fullWidth size="lg">💌 Lihat Semua Pesan</Button>
				<div class="mt-2">
					<Button href="/gallery" variant="secondary" fullWidth size="lg">
						📸 Lihat Kenangan Kita
					</Button>
				</div>
				<div class="mt-1 text-center">
					<Button
						variant="ghost"
						size="sm"
						disabled={isResetting || isNavigating}
						onclick={restartMission}
					>
						{isResetting ? 'Mengulang...' : 'Main ulang dari awal'}
					</Button>
				</div>
			{:else}
				<Button
					fullWidth
					size="lg"
					disabled={!isReady || isNavigating}
					onclick={startMission}
				>
					{isNavigating
						? 'Membuka petunjuk...'
						: hasStarted
							? 'Lanjutkan Misi'
							: 'Mulai Misi'}
				</Button>

				{#if hasStarted}
					<div class="mt-1 text-center">
						<Button
							variant="ghost"
							size="sm"
							disabled={isResetting || isNavigating}
							onclick={restartMission}
						>
							{isResetting ? 'Mengulang...' : 'Ulangi dari awal'}
						</Button>
					</div>
				{/if}
			{/if}
		</div>
	{/snippet}

	<div class="page-enter relative flex h-full min-h-0 items-center">
		<HeartsScatter density="low" />

		<div class="polaroid-pin" aria-hidden="true">
			<Polaroid
				src="/assets/illustrations/couple-polaroid-placeholder.webp"
				width="5.25rem"
				tilt={6}
				tape="peach"
			/>
		</div>

		<PaperCard compact torn tilt={-1} class="relative w-full">
			<div class="text-center">
				<div
					class="opening-illustration gentle-float mx-auto max-w-36 min-[360px]:max-w-44 min-[400px]:max-w-52"
				>
					<img
						class="aspect-square w-full object-contain"
						src="/assets/illustrations/opening-room.webp"
						alt="Ilustrasi ruangan hangat di rumah kita"
					/>
				</div>

				<div class="soft-pulse mx-auto -mt-2 flex size-10 items-center justify-center rounded-full bg-rose/15">
					<img class="size-6" src="/assets/icons/heart.svg" alt="" aria-hidden="true" />
				</div>

				<h1 class="font-script mt-3 text-4xl font-bold leading-tight text-brown min-[390px]:text-5xl">
					Selamat ulang tahun,<br />sayangku Ella Adelia ❤️
				</h1>

				<p class="birth-date font-body mx-auto mt-2 w-fit text-xs font-semibold text-rose-dark">
					<span class="birth-date__line"></span>
					7 Juli 1998
					<span class="birth-date__line"></span>
				</p>

				<p class="font-body mx-auto mt-3 max-w-sm text-sm leading-6 text-muted min-[390px]:text-base">
					Aku menuliskan beberapa catatan kecil dan menaruhnya di tempat-tempat yang
					berarti buat kita. Ikuti petunjuknya satu per satu, jangan lompat, dan nikmati
					perjalanannya.
				</p>

				<p class="font-body mt-3 text-xs leading-5 text-muted">
					Ditulis dengan cinta, khusus untuk hari istimewamu.
				</p>
			</div>
		</PaperCard>

		{#if !showCover}
			<WifeCharacter side="right" width="7.25rem" />
		{/if}
	</div>
</AppShell>

{#if showCover}
	<div
		class="intro-cover"
		class:intro-cover--leaving={isOpeningCover}
		role="dialog"
		aria-modal="true"
		aria-label="Catatan ulang tahun untuk Ella Adelia"
	>
		<div class="intro-cover__bg" aria-hidden="true"></div>
		<HeartsScatter />

		<div class="intro-cover__inner">
			<div class="intro-polaroid" aria-hidden="true">
				<Polaroid
					src="/assets/illustrations/couple-polaroid-placeholder.webp"
					width="5rem"
					tilt={-7}
					tape="purple"
				/>
			</div>

			<PaperCard torn tilt={-1} class="relative w-full">
				<div class="text-center">
					<TapeLabel text="7 Juli — Hari Spesialmu" color="peach" icon="/assets/icons/heart.svg" />

					<div class="intro-illus gentle-float mx-auto mt-4 max-w-40">
						<img
							class="aspect-square w-full object-contain"
							src="/assets/illustrations/envelope-heart.webp"
							alt="Amplop kecil berhias hati"
						/>
					</div>

					<h1 class="font-script mt-3 text-4xl font-bold leading-tight text-brown min-[390px]:text-5xl">
						Untuk Istriku Tercinta,<br />Ella Adelia
					</h1>

					<p class="font-body mx-auto mt-3 max-w-xs text-sm leading-6 text-muted min-[390px]:text-base">
						Hari ini, izinkan aku menuntunmu menyusuri sudut-sudut rumah kita lewat
						beberapa catatan kecil. Tarik napas, tersenyum, lalu ikuti pelan-pelan, ya.
					</p>

					<div class="mt-6">
						<Button fullWidth size="lg" disabled={isOpeningCover} onclick={openCover}>
							{isOpeningCover ? 'Membuka...' : 'Ikuti Langkahnya ❤️'}
						</Button>
						<p class="font-body mt-3 text-xs leading-5 text-muted">
							Ketuk untuk memulai — musik akan menyala 🎵
						</p>
					</div>
				</div>
			</PaperCard>
		</div>
	</div>
{/if}

<style>
	.birth-date {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		letter-spacing: 0.08em;
	}

	.birth-date__line {
		width: 1.5rem;
		height: 1px;
		background: var(--gift-color-tan);
	}

	.intro-cover {
		position: fixed;
		inset: 0;
		z-index: 90;
		display: grid;
		place-items: center;
		overflow: auto;
		padding: 1.5rem;
		background-color: var(--gift-color-cream);
		animation: intro-cover-in 420ms ease both;
	}

	.intro-cover--leaving {
		animation: intro-cover-out 500ms ease forwards;
	}

	/* Photo backdrop, constrained to a mobile-width band and centered */
	.intro-cover__bg {
		position: absolute;
		inset: 0;
		z-index: -1;
		margin-inline: auto;
		width: 100%;
		max-width: 30rem;
		background-color: var(--gift-color-cream);
		background-image:
			linear-gradient(180deg, rgb(255 249 240 / 42%), rgb(107 63 42 / 34%)),
			url('/assets/gallery/1783167323753.webp');
		background-position: center;
		background-size: cover;
		box-shadow: 0 0 60px rgb(107 63 42 / 20%);
	}

	.intro-cover__inner {
		position: relative;
		width: min(100%, 25rem);
	}

	.intro-polaroid {
		position: absolute;
		top: -2.25rem;
		left: -0.5rem;
		z-index: 30;
		pointer-events: none;
	}

	@keyframes intro-cover-in {
		from {
			opacity: 0;
			transform: scale(1.02);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}

	@keyframes intro-cover-out {
		from {
			opacity: 1;
			transform: scale(1);
		}
		to {
			opacity: 0;
			transform: scale(0.98);
			visibility: hidden;
		}
	}

	@media (max-height: 640px) {
		.intro-polaroid {
			display: none;
		}

		.intro-illus {
			max-width: 7rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.intro-cover,
		.intro-cover--leaving {
			animation: none;
		}
	}

	.polaroid-pin {
		position: absolute;
		top: -0.25rem;
		right: -0.35rem;
		z-index: 30;
		pointer-events: none;
	}

	@media (max-height: 620px) {
		.polaroid-pin {
			display: none;
		}
	}

	@media (max-height: 540px) {
		.opening-illustration {
			max-width: 6.5rem;
		}
	}
</style>
