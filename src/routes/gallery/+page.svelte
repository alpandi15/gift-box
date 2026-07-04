<script lang="ts">
	import { goto } from '$app/navigation';
	import { AppShell, Button, HeartsScatter, Tape } from '$lib';
	import { canOpenFinal } from '$lib/utils/stepGuard';
	import { getHuntState } from '$lib/utils/storage';
	import { onDestroy, onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	const images = [
		'/assets/gallery/IMG_20220317_213441.webp',
		'/assets/gallery/IMG_20220328_185457.webp',
		'/assets/gallery/IMG_20220626_152008.webp',
		'/assets/gallery/1783167323605.webp',
		'/assets/gallery/ella.webp',
		'/assets/gallery/1783167323622.jpg',
		'/assets/gallery/1783167323646.jpg',
		'/assets/gallery/1783167323669.jpg',
		'/assets/gallery/1783167323689.jpg',
		'/assets/gallery/1783167323753.webp',
		'/assets/gallery/1783167323779.webp',
		'/assets/gallery/1783167323804.webp',
		'/assets/gallery/1783167323829.webp',
		'/assets/gallery/1783167323855.webp',
		'/assets/gallery/1783167323880.webp',
		'/assets/gallery/1783167323896.jpg',
		'/assets/gallery/1783167323912.jpg',
	];

	let isReady = $state(false);
	let active = $state(0);
	let timer: ReturnType<typeof setInterval> | undefined;

	onMount(() => {
		if (!canOpenFinal(getHuntState())) {
			void goto('/', { replaceState: true });
			return;
		}

		isReady = true;
		startAuto();
	});

	onDestroy(() => {
		if (timer) clearInterval(timer);
	});

	function startAuto() {
		if (typeof window === 'undefined') return;
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		timer = setInterval(() => {
			active = (active + 1) % images.length;
		}, 4200);
	}

	function restartAuto() {
		if (timer) clearInterval(timer);
		startAuto();
	}

	function next() {
		active = (active + 1) % images.length;
		restartAuto();
	}

	function prev() {
		active = (active - 1 + images.length) % images.length;
		restartAuto();
	}

	function go(index: number) {
		active = index;
		restartAuto();
	}
</script>

<AppShell title="Kenangan Kita ❤️" background="final" compact bottomSlot>
	{#snippet bottom()}
		<div class="bottom-panel">
			<Button href="/" fullWidth size="lg">Selesai ❤️</Button>
		</div>
	{/snippet}

	<div class="page-enter relative flex h-full min-h-0 flex-col">
		<HeartsScatter density="low" />

		{#if isReady}
			<header class="relative z-10 shrink-0 pt-1 text-center">
				<h1 class="font-script text-3xl font-bold leading-tight text-brown">Kenangan Kita</h1>
				<p class="font-body text-xs leading-5 text-muted">
					Sepenggal cerita kita, dari waktu ke waktu ❤️
				</p>
			</header>

			<div class="relative z-10 flex min-h-0 flex-1 flex-col justify-center py-2">
				<figure class="photo-book">
					<Tape color="neutral" position="top-center" rotation={-3} width="5.5rem" />

					<div class="photo-book__stage">
						{#key active}
							<img
								class="photo-book__img"
								src={images[active]}
								alt={`Kenangan kita nomor ${active + 1}`}
								in:fade={{ duration: 360 }}
							/>
						{/key}
					</div>

					<figcaption class="photo-book__cap font-script">
						Kenangan kita · {active + 1} / {images.length}
					</figcaption>
				</figure>

				<div class="mt-3 flex items-center justify-center gap-4">
					<button type="button" class="nav-btn" aria-label="Foto sebelumnya" onclick={prev}>
						‹
					</button>

					<div class="flex max-w-[12rem] flex-wrap items-center justify-center gap-1.5">
						{#each images as _image, index (index)}
							<button
								type="button"
								class="dot"
								class:dot--active={index === active}
								aria-label={`Ke foto ${index + 1}`}
								aria-current={index === active}
								onclick={() => go(index)}
							></button>
						{/each}
					</div>

					<button type="button" class="nav-btn" aria-label="Foto berikutnya" onclick={next}>
						›
					</button>
				</div>
			</div>
		{/if}
	</div>
</AppShell>

<style>
	.photo-book {
		position: relative;
		width: min(100%, 22rem);
		margin: 0 auto;
		padding: 0.75rem 0.75rem 0.5rem;
		border-radius: 0.35rem;
		background: #fffdf8;
		box-shadow: var(--gift-shadow-card);
		transform: rotate(-1deg);
		animation: photo-enter 480ms cubic-bezier(0.22, 1, 0.36, 1) both;
	}

	.photo-book__stage {
		position: relative;
		width: 100%;
		height: clamp(15rem, 46vh, 26rem);
		overflow: hidden;
		border-radius: 0.2rem;
		background: var(--gift-color-cream);
	}

	.photo-book__img {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.photo-book__cap {
		margin-top: 0.4rem;
		color: var(--gift-color-brown);
		font-size: 1.2rem;
		font-weight: 600;
		line-height: 1.2;
		text-align: center;
	}

	.nav-btn {
		display: grid;
		width: 2.5rem;
		height: 2.5rem;
		flex-shrink: 0;
		place-items: center;
		border: 1px solid rgb(255 255 255 / 70%);
		border-radius: 999px;
		background: var(--gift-color-cream-soft);
		color: var(--gift-color-rose-dark);
		font-size: 1.6rem;
		line-height: 1;
		box-shadow: var(--gift-shadow-soft);
		transition: transform 120ms ease;
	}

	.nav-btn:active {
		transform: scale(0.94);
	}

	.dot {
		width: 0.5rem;
		height: 0.5rem;
		border-radius: 999px;
		background: var(--gift-color-tan);
		transition:
			background-color 160ms ease,
			transform 160ms ease;
	}

	.dot--active {
		background: var(--gift-color-rose);
		transform: scale(1.35);
	}

	@keyframes photo-enter {
		from {
			opacity: 0;
			transform: rotate(-1deg) translateY(0.6rem);
		}
		to {
			opacity: 1;
			transform: rotate(-1deg) translateY(0);
		}
	}

	@media (max-height: 680px) {
		.photo-book__stage {
			height: clamp(11rem, 38vh, 18rem);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.photo-book {
			animation: none;
		}
	}
</style>
