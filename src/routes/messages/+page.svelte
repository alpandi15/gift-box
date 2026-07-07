<script lang="ts">
	import { goto } from '$app/navigation';
	import { AppShell, Button, HeartsScatter } from '$lib';
	import { giftSteps } from '$lib/data/giftSteps';
	import { canOpenFinal } from '$lib/utils/stepGuard';
	import { getHuntState } from '$lib/utils/storage';
	import { onMount } from 'svelte';

	let isReady = $state(false);
	let active = $state(0);
	let cardEl = $state<HTMLElement>();
	let isSharing = $state(false);
	let shareFeedback = $state('');

	const step = $derived(giftSteps[active]);

	onMount(() => {
		if (!canOpenFinal(getHuntState())) {
			void goto('/', { replaceState: true });
			return;
		}
		isReady = true;
	});

	function next() {
		active = (active + 1) % giftSteps.length;
	}

	function prev() {
		active = (active - 1 + giftSteps.length) % giftSteps.length;
	}

	function go(index: number) {
		active = index;
	}

	async function shareCard() {
		if (!cardEl || isSharing) return;

		isSharing = true;
		shareFeedback = '';

		try {
			const { toPng } = await import('html-to-image');
			const dataUrl = await toPng(cardEl, {
				pixelRatio: 3,
				cacheBust: true,
				backgroundColor: '#fff6ea'
			});

			const blob = await (await fetch(dataUrl)).blob();
			const file = new File([blob], `pesan-untuk-ella-${active + 1}.png`, { type: 'image/png' });

			const shareData = {
				files: [file],
				title: 'Pesan untuk Ella Adelia',
				text: step.message
			};

			if (navigator.canShare?.({ files: [file] }) && navigator.share) {
				await navigator.share(shareData);
				shareFeedback = 'Terbagikan ❤️';
			} else {
				const link = document.createElement('a');
				link.href = dataUrl;
				link.download = file.name;
				link.click();
				shareFeedback = 'Gambar tersimpan ❤️';
			}
		} catch (error) {
			if ((error as Error)?.name !== 'AbortError') {
				shareFeedback = 'Gagal membuat gambar. Coba lagi, ya.';
			}
		} finally {
			isSharing = false;
			if (shareFeedback) {
				window.setTimeout(() => (shareFeedback = ''), 2600);
			}
		}
	}
</script>

<AppShell title="Semua Pesan ❤️" background="final" compact bottomSlot>
	{#snippet bottom()}
		<div class="bottom-panel space-y-2">
			<Button fullWidth size="lg" disabled={isSharing} onclick={shareCard}>
				<img class="size-5 brightness-0 invert" src="/assets/icons/heart.svg" alt="" aria-hidden="true" />
				{isSharing ? 'Menyiapkan gambar...' : 'Bagikan / Simpan Pesan Ini'}
			</Button>
			<div class="text-center">
				<Button href="/" variant="ghost" size="sm">Kembali</Button>
			</div>
			{#if shareFeedback}
				<p class="text-center text-xs font-semibold text-rose-dark" role="status">{shareFeedback}</p>
			{/if}
		</div>
	{/snippet}

	<div class="page-enter relative flex h-full min-h-0 flex-col">
		<HeartsScatter density="low" />

		{#if isReady}
			<div class="relative z-10 flex min-h-0 flex-1 flex-col justify-center">
				<div class="card-scroll">
					<article class="share-card" bind:this={cardEl}>
						<div class="share-card__topglow" aria-hidden="true"></div>

						<span class="share-card__badge">Pesan {active + 1} dari {giftSteps.length}</span>

						<div class="share-card__illus">
							<img src={step.illustration} alt="" aria-hidden="true" />
						</div>

						<h2 class="share-card__title font-script">{step.title}</h2>

						<p class="share-card__msg font-script">{step.message}</p>

						<div class="share-card__foot">
							<span class="share-card__heart">❤</span>
							<span>Dengan cinta, suamimu — Muhammad Al-Pandi</span>
						</div>

						<img
							class="share-card__character"
							src="/assets/illustrations/character.png"
							alt=""
							aria-hidden="true"
						/>
					</article>
				</div>

				<div class="relative z-10 mt-3 flex shrink-0 items-center justify-center gap-4">
					<button type="button" class="nav-btn" aria-label="Pesan sebelumnya" onclick={prev}>‹</button>

					<div class="flex items-center justify-center gap-1.5">
						{#each giftSteps as _step, index (index)}
							<button
								type="button"
								class="dot"
								class:dot--active={index === active}
								aria-label={`Ke pesan ${index + 1}`}
								aria-current={index === active}
								onclick={() => go(index)}
							></button>
						{/each}
					</div>

					<button type="button" class="nav-btn" aria-label="Pesan berikutnya" onclick={next}>›</button>
				</div>
			</div>
		{/if}
	</div>
</AppShell>

<style>
	.card-scroll {
		min-height: 0;
		flex: 1 1 auto;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow-y: auto;
		padding: 0.25rem;
	}

	.share-card {
		position: relative;
		width: min(100%, 20rem);
		overflow: hidden;
		padding: 1.5rem 1.35rem 1.25rem;
		border: 1px solid rgb(255 255 255 / 70%);
		border-radius: 1.6rem;
		background:
			radial-gradient(120% 80% at 50% -10%, rgb(244 166 160 / 35%), transparent 60%),
			linear-gradient(165deg, #fff9f0 0%, #fff2ea 55%, #ffe7e6 100%);
		box-shadow: 0 20px 50px rgb(107 63 42 / 18%);
		text-align: center;
		animation: card-enter 460ms cubic-bezier(0.22, 1, 0.36, 1) both;
	}

	.share-card__topglow {
		position: absolute;
		top: -40%;
		left: 50%;
		width: 140%;
		height: 60%;
		transform: translateX(-50%);
		background: radial-gradient(closest-side, rgb(239 182 106 / 30%), transparent);
		pointer-events: none;
	}

	.share-card__badge {
		position: relative;
		display: inline-block;
		padding: 0.25rem 0.85rem;
		border-radius: 999px;
		background: rgb(231 126 134 / 14%);
		color: var(--gift-color-rose-dark);
		font-family: var(--font-family-sans);
		font-size: 0.68rem;
		font-weight: 800;
		letter-spacing: 0.12em;
		text-transform: uppercase;
	}

	.share-card__illus {
		margin: 0.75rem auto 0;
		width: 8.5rem;
		max-width: 55%;
	}

	.share-card__illus img {
		width: 100%;
		height: auto;
		object-fit: contain;
		filter: drop-shadow(0 6px 10px rgb(107 63 42 / 14%));
	}

	.share-card__title {
		margin-top: 0.35rem;
		color: var(--gift-color-brown);
		font-size: 1.7rem;
		font-weight: 700;
		line-height: 1.1;
	}

	.share-card__msg {
		margin-top: 0.5rem;
		color: var(--gift-color-ink);
		font-size: 1.35rem;
		font-weight: 500;
		line-height: 1.5;
	}

	.share-card__foot {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.4rem;
		margin-top: 1rem;
		padding-top: 0.75rem;
		padding-right: 4.25rem;
		padding-left: 0.5rem;
		border-top: 1px dashed rgb(200 95 105 / 35%);
		color: var(--gift-color-rose-dark);
		font-family: var(--font-family-sans);
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.02em;
		text-align: left;
	}

	.share-card__heart {
		flex-shrink: 0;
		color: var(--gift-color-rose);
	}

	.share-card__character {
		position: absolute;
		right: 0.35rem;
		bottom: 0.25rem;
		z-index: 3;
		width: 4.75rem;
		height: auto;
		pointer-events: none;
		filter: drop-shadow(0 4px 8px rgb(107 63 42 / 20%));
		transform-origin: bottom center;
		animation: share-char-sway 3.8s ease-in-out infinite;
	}

	@keyframes share-char-sway {
		0%,
		100% {
			transform: rotate(-2.5deg);
		}
		50% {
			transform: rotate(2.5deg);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.share-card__character {
			animation: none;
		}
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

	@keyframes card-enter {
		from {
			opacity: 0;
			transform: translateY(0.6rem) scale(0.985);
		}
		to {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}

	@media (max-height: 700px) {
		.share-card__illus {
			width: 6rem;
		}

		.share-card__msg {
			font-size: 1.2rem;
			line-height: 1.45;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.share-card {
			animation: none;
		}
	}
</style>
