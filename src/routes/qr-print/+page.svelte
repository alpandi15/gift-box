<script lang="ts">
	import { Button, PaperCard } from '$lib';
	import { giftSteps } from '$lib/data/giftSteps';
	import QRCode from 'qrcode';
	import { onMount } from 'svelte';

	type QrItemDefinition = {
		id: string;
		label: string;
		qrToken: string;
		note: string;
	};

	type QrItem = QrItemDefinition & {
		qrDataUrl: string;
	};

	const qrDefinitions: QrItemDefinition[] = giftSteps.map((step, index) => ({
		id: `gift-${String.fromCharCode(97 + index)}`,
		label: `QR Giftbox ${String.fromCharCode(65 + index)}`,
		qrToken: step.qrToken,
		note: `Tempel di giftbox ${String.fromCharCode(65 + index)}.`
	}));

	let qrItems = $state<QrItem[]>([]);
	let isLoading = $state(true);
	let generationError = $state('');
	let pasteMode = $state(false);
	let copyFeedback = $state<Record<string, string>>({});

	onMount(async () => {
		try {
			qrItems = await Promise.all(
				qrDefinitions.map(async (item) => {
					const qrDataUrl = await QRCode.toDataURL(item.qrToken, {
						width: 512,
						margin: 2,
						errorCorrectionLevel: 'H',
						color: {
							dark: '#3A2520',
							light: '#FFFFFF'
						}
					});

					return { ...item, qrDataUrl };
				})
			);
		} catch {
			generationError =
				'QR belum berhasil dibuat. Coba refresh halaman atau jalankan ulang development server.';
		} finally {
			isLoading = false;
		}
	});

	async function copyToken(item: QrItem) {
		try {
			await navigator.clipboard.writeText(item.qrToken);
			setCopyFeedback(item.id, 'Token disalin');
		} catch {
			try {
				const textarea = document.createElement('textarea');
				textarea.value = item.qrToken;
				textarea.style.position = 'fixed';
				textarea.style.opacity = '0';
				document.body.appendChild(textarea);
				textarea.select();
				const copied = document.execCommand('copy');
				textarea.remove();

				setCopyFeedback(
					item.id,
					copied ? 'Token disalin' : 'Salin token secara manual dari teks di atas'
				);
			} catch {
				setCopyFeedback(item.id, 'Salin token secara manual dari teks di atas');
			}
		}
	}

	function setCopyFeedback(itemId: string, message: string) {
		copyFeedback = { ...copyFeedback, [itemId]: message };

		window.setTimeout(() => {
			const nextFeedback = { ...copyFeedback };
			delete nextFeedback[itemId];
			copyFeedback = nextFeedback;
		}, 2200);
	}

	function printQrCodes() {
		window.print();
	}
</script>

<svelte:head>
	<title>QR Print — Birthday Gift Hunt</title>
	<meta
		name="description"
		content="Halaman internal untuk membuat dan mencetak QR Birthday Gift Hunt."
	/>
</svelte:head>

<main class="qr-page min-h-dvh px-4 pt-5 pb-[calc(1.5rem+env(safe-area-inset-bottom))] sm:px-6 lg:px-8">
	<div class="mx-auto max-w-6xl">
		<header class="print-controls">
			<PaperCard>
				<div class="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
					<div>
						<div
							class="inline-flex items-center gap-2 rounded-full bg-purple/12 px-3 py-2 text-xs font-extrabold uppercase tracking-[0.14em] text-brown"
						>
							<img class="size-4" src="/assets/icons/qr.svg" alt="" aria-hidden="true" />
							<span>Owner tools</span>
						</div>
						<h1 class="mt-4 text-3xl font-extrabold text-brown">QR Gift Hunt</h1>
						<p class="mt-3 max-w-2xl leading-7 text-muted">
							QR berisi token internal dan hanya dibaca oleh scanner di dalam web. Aktifkan
							mode tempel, lalu cetak untuk hadiah fisik.
						</p>
					</div>

					<div class="flex flex-col gap-3 sm:flex-row lg:flex-col">
						<Button
							variant="secondary"
							fullWidth
							disabled={isLoading || qrItems.length === 0}
							onclick={() => (pasteMode = !pasteMode)}
						>
							{pasteMode ? 'Tampilkan Label Internal' : 'Mode Tempel ke Giftbox'}
						</Button>
						<Button
							fullWidth
							disabled={isLoading || qrItems.length === 0}
							onclick={printQrCodes}
						>
							<img
								class="size-5 brightness-0 invert"
								src="/assets/icons/qr.svg"
								alt=""
								aria-hidden="true"
							/>
							Print QR
						</Button>
					</div>
				</div>

				<div
					class="mt-5 flex items-center justify-between gap-4 rounded-lg border border-peach/40 bg-white/55 p-4"
				>
					<div>
						<p class="font-bold text-brown">Mode tempel ke giftbox</p>
						<p class="mt-1 text-sm leading-5 text-muted">
							Sembunyikan label, token, dan catatan saat preview maupun print.
						</p>
					</div>
					<button
						type="button"
						class="relative h-8 w-14 shrink-0 rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose"
						class:bg-rose={pasteMode}
						class:bg-tan={false === pasteMode}
						role="switch"
						aria-checked={pasteMode}
						aria-label="Mode tempel ke giftbox"
						onclick={() => (pasteMode = !pasteMode)}
					>
						<span
							class="absolute top-1 size-6 rounded-full bg-white shadow-soft transition-transform"
							class:translate-x-7={pasteMode}
							class:translate-x-1={false === pasteMode}
						></span>
					</button>
				</div>
			</PaperCard>
		</header>

		{#if isLoading}
			<div class="mt-8 rounded-xl bg-white/70 p-10 text-center shadow-soft" aria-live="polite">
				<img
					class="mx-auto size-10 animate-pulse"
					src="/assets/icons/qr.svg"
					alt=""
					aria-hidden="true"
				/>
				<p class="mt-4 font-semibold text-muted">Membuat QR dari token internal...</p>
			</div>
		{:else if generationError}
			<div
				class="mt-8 rounded-xl border border-rose/30 bg-white/80 p-8 text-center shadow-soft"
				role="alert"
			>
				<img
					class="mx-auto size-9"
					src="/assets/icons/lock.svg"
					alt=""
					aria-hidden="true"
				/>
				<h2 class="mt-4 text-xl font-extrabold text-brown">QR belum bisa ditampilkan</h2>
				<p class="mt-2 leading-7 text-muted">{generationError}</p>
			</div>
		{:else}
			<section class="qr-grid mt-8 grid gap-6 md:grid-cols-2" aria-label="Daftar QR siap print">
				{#each qrItems as item (item.id)}
					<article class="qr-card" data-paste-mode={pasteMode}>
						{#if !pasteMode}
							<div class="internal-details">
								<p class="text-xs font-extrabold uppercase tracking-[0.14em] text-rose-dark">
									Internal
								</p>
								<h2 class="mt-1 text-xl font-extrabold text-brown">{item.label}</h2>
							</div>
						{/if}

						<div class="qr-image-wrap">
							<img
								class="qr-image"
								src={item.qrDataUrl}
								alt={`QR internal ${item.label}`}
								width="512"
								height="512"
							/>
						</div>

						<p class="scan-label">Scan aku ❤️</p>

						{#if !pasteMode}
							<div class="internal-details mt-4 w-full">
								<p class="break-all rounded-md bg-cream px-3 py-2 text-xs leading-5 text-ink">
									{item.qrToken}
								</p>
								<p class="mt-3 text-sm leading-6 text-muted">{item.note}</p>

								<div class="copy-control mt-4">
									<Button
										variant="secondary"
										size="sm"
										fullWidth
										onclick={() => copyToken(item)}
									>
										{copyFeedback[item.id] ?? 'Copy Token'}
									</Button>
								</div>
							</div>
						{/if}
					</article>
				{/each}
			</section>
		{/if}
	</div>
</main>

<style>
	.qr-page {
		background-color: var(--gift-color-cream);
		background-image: url('/assets/backgrounds/warm-cream-bg.webp');
		background-position: center;
		background-size: cover;
	}

	.qr-card {
		display: flex;
		min-width: 0;
		flex-direction: column;
		align-items: center;
		border: 2px dashed var(--gift-color-tan);
		border-radius: var(--gift-radius-lg);
		background: var(--gift-color-white);
		padding: 1.5rem;
		text-align: center;
		box-shadow: var(--gift-shadow-soft);
		break-inside: avoid;
		page-break-inside: avoid;
		animation: qr-card-enter 420ms cubic-bezier(0.22, 1, 0.36, 1) both;
	}

	.qr-card[data-paste-mode='true'] {
		justify-content: center;
		min-height: 23rem;
	}

	.qr-image-wrap {
		display: grid;
		width: min(100%, 17.5rem);
		aspect-ratio: 1;
		margin-top: 1rem;
		place-items: center;
		border-radius: var(--gift-radius-md);
		background: var(--gift-color-white);
	}

	.qr-image {
		width: min(100%, 15rem);
		height: auto;
		image-rendering: auto;
	}

	.scan-label {
		margin-top: 0.75rem;
		color: var(--gift-color-brown);
		font-family: var(--font-family-sans);
		font-size: 1.125rem;
		font-weight: 800;
	}

	.qr-page :global(h1),
	.qr-page :global(h2),
	.qr-page :global(h3) {
		font-family: var(--font-family-sans);
	}

	@keyframes qr-card-enter {
		from {
			opacity: 0;
			transform: translateY(0.5rem);
		}

		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.qr-card {
			animation: none;
		}
	}

	@media print {
		:global(html),
		:global(body) {
			background: white !important;
			print-color-adjust: exact;
			-webkit-print-color-adjust: exact;
		}

		:global(body) {
			min-width: 0;
		}

		.qr-page {
			min-height: auto;
			padding: 0;
			background: white;
		}

		.print-controls,
		.copy-control {
			display: none !important;
		}

		.qr-grid {
			display: grid;
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: 10mm;
			margin: 0;
		}

		.qr-card {
			min-height: 0;
			border: 1.5px dashed #b99972;
			border-radius: 6mm;
			padding: 8mm;
			box-shadow: none;
			animation: none;
		}

		.qr-card[data-paste-mode='true'] {
			min-height: 105mm;
		}

		.qr-image-wrap {
			width: 68mm;
			margin-top: 3mm;
		}

		.qr-image {
			width: 63.5mm;
			height: 63.5mm;
		}

		.scan-label {
			margin-top: 3mm;
			font-size: 14pt;
		}

		.internal-details {
			display: block;
		}
	}

	@page {
		size: A4 portrait;
		margin: 12mm;
	}
</style>
