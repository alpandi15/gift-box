<script lang="ts">
	import { Button, PaperCard, TapeLabel } from '$lib';
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
		label: `Giftbox ${String.fromCharCode(65 + index)}`,
		qrToken: step.qrToken,
		note: `Tempel di giftbox ${String.fromCharCode(65 + index)}.`
	}));

	let qrItems = $state<QrItem[]>([]);
	let isLoading = $state(true);
	let generationError = $state('');
	let pasteMode = $state(true);
	let isDownloading = $state(false);
	let copyFeedback = $state<Record<string, string>>({});

	onMount(async () => {
		try {
			qrItems = await Promise.all(
				qrDefinitions.map(async (item) => {
					const qrDataUrl = await QRCode.toDataURL(item.qrToken, {
						width: 512,
						margin: 1,
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
			setCopyFeedback(item.id, 'Salin token secara manual');
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

	async function downloadPdf() {
		if (!qrItems.length || isDownloading) return;

		isDownloading = true;

		try {
			const { jsPDF } = await import('jspdf');
			const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

			const pageW = 210;
			const pageH = 297;
			const cardW = 85.6; // ID card / KTP width
			const cardH = 54; // ID card / KTP height
			const gapX = 8;
			const gapY = 10;
			const cols = 2;
			const rows = Math.ceil(qrItems.length / cols);

			const gridW = cols * cardW + (cols - 1) * gapX;
			const startX = (pageW - gridW) / 2;
			const gridH = rows * cardH + (rows - 1) * gapY;
			const startY = Math.max(16, (pageH - gridH) / 2);

			qrItems.forEach((item, index) => {
				const col = index % cols;
				const row = Math.floor(index / cols);
				const x = startX + col * (cardW + gapX);
				const y = startY + row * (cardH + gapY);

				// Dashed cut border
				doc.setDrawColor(185, 153, 114);
				doc.setLineWidth(0.4);
				doc.setLineDashPattern([1.6, 1.2], 0);
				doc.roundedRect(x, y, cardW, cardH, 3, 3);
				doc.setLineDashPattern([], 0);

				// QR on the left
				const qr = 40;
				const qx = x + 6;
				const qy = y + (cardH - qr) / 2;
				doc.addImage(item.qrDataUrl, 'PNG', qx, qy, qr, qr);

				// Text on the right
				const tx = qx + qr + 6;
				doc.setTextColor(107, 63, 42);
				doc.setFont('helvetica', 'bold');
				doc.setFontSize(15);
				doc.text('Scan aku!', tx, y + 16);

				doc.setFont('helvetica', 'normal');
				doc.setFontSize(8.5);
				doc.setTextColor(140, 111, 102);
				doc.text('Buka kamera dari', tx, y + 24);
				doc.text('web, arahkan ke sini.', tx, y + 28.5);

				doc.setFont('courier', 'bold');
				doc.setFontSize(8);
				doc.setTextColor(58, 37, 32);
				doc.text(`Kode: ${item.qrToken}`, tx, y + 40);
			});

			doc.save('qr-gift-hunt.pdf');
		} catch {
			generationError = 'PDF belum berhasil dibuat. Coba lagi, atau gunakan tombol Print.';
		} finally {
			isDownloading = false;
		}
	}
</script>

<svelte:head>
	<title>Cetak QR — Untuk Ella Adelia</title>
	<meta
		name="description"
		content="Halaman internal untuk membuat, mengunduh, dan mencetak QR petunjuk untuk Ella Adelia."
	/>
</svelte:head>

<main class="qr-page min-h-dvh px-4 pt-6 pb-[calc(2rem+env(safe-area-inset-bottom))] sm:px-6 lg:px-8">
	<div class="mx-auto max-w-5xl">
		<header class="print-controls">
			<PaperCard torn tilt={-0.5}>
				<div class="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
					<div>
						<TapeLabel text="Owner tools" color="purple" icon="/assets/icons/qr.svg" />
						<h1 class="font-script mt-3 text-4xl font-bold leading-tight text-brown sm:text-5xl">
							QR Gift Hunt
						</h1>
						<p class="mt-2 max-w-2xl leading-7 text-muted">
							Setiap kartu seukuran KTP, siap dicetak di kertas A4 lalu digunting dan ditempel di
							hadiah. Ada kode kecil di tiap kartu untuk cadangan kalau kamera tidak bisa scan.
						</p>
					</div>

					<div class="flex flex-col gap-3 sm:flex-row lg:flex-col">
						<Button
							fullWidth
							disabled={isLoading || qrItems.length === 0 || isDownloading}
							onclick={downloadPdf}
						>
							<img
								class="size-5 brightness-0 invert"
								src="/assets/icons/qr.svg"
								alt=""
								aria-hidden="true"
							/>
							{isDownloading ? 'Menyiapkan PDF...' : 'Download PDF (A4)'}
						</Button>
						<Button
							variant="secondary"
							fullWidth
							disabled={isLoading || qrItems.length === 0}
							onclick={printQrCodes}
						>
							Print Langsung
						</Button>
					</div>
				</div>

				<div
					class="mt-5 flex items-center justify-between gap-4 rounded-lg border border-peach/40 bg-white/55 p-4"
				>
					<div>
						<p class="font-bold text-brown">Mode tempel ke hadiah</p>
						<p class="mt-1 text-sm leading-5 text-muted">
							Sembunyikan label internal & tombol. Kode kecil tetap tampil untuk cadangan input manual.
						</p>
					</div>
					<button
						type="button"
						class="relative h-8 w-14 shrink-0 rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose"
						class:bg-rose={pasteMode}
						class:bg-tan={!pasteMode}
						role="switch"
						aria-checked={pasteMode}
						aria-label="Mode tempel ke hadiah"
						onclick={() => (pasteMode = !pasteMode)}
					>
						<span
							class="absolute top-1 size-6 rounded-full bg-white shadow-soft transition-transform"
							class:translate-x-7={pasteMode}
							class:translate-x-1={!pasteMode}
						></span>
					</button>
				</div>
			</PaperCard>
		</header>

		{#if isLoading}
			<div class="mt-8 rounded-xl bg-white/70 p-10 text-center shadow-soft" aria-live="polite">
				<img class="mx-auto size-10 animate-pulse" src="/assets/icons/qr.svg" alt="" aria-hidden="true" />
				<p class="mt-4 font-semibold text-muted">Membuat QR dari token internal...</p>
			</div>
		{:else if generationError}
			<div
				class="mt-8 rounded-xl border border-rose/30 bg-white/80 p-8 text-center shadow-soft"
				role="alert"
			>
				<img class="mx-auto size-9" src="/assets/icons/lock.svg" alt="" aria-hidden="true" />
				<h2 class="mt-4 text-xl font-extrabold text-brown">Ada yang belum beres</h2>
				<p class="mt-2 leading-7 text-muted">{generationError}</p>
			</div>
		{:else}
			<section class="qr-grid" aria-label="Daftar QR siap cetak">
				{#each qrItems as item (item.id)}
					<article class="qr-card" data-paste-mode={pasteMode}>
						<div class="qr-card__qr">
							<img
								class="qr-image"
								src={item.qrDataUrl}
								alt={`QR ${item.label}`}
								width="512"
								height="512"
							/>
						</div>

						<div class="qr-card__body">
							{#if !pasteMode}
								<p class="qr-card__internal">{item.label}</p>
							{/if}
							<p class="qr-card__scan font-script">Scan aku ❤️</p>
							<p class="qr-card__hint">Buka kamera dari web, lalu arahkan ke sini.</p>
							<p class="qr-card__code">Kode: <span>{item.qrToken}</span></p>

							{#if !pasteMode}
								<div class="copy-control mt-2">
									<Button variant="secondary" size="sm" onclick={() => copyToken(item)}>
										{copyFeedback[item.id] ?? 'Copy Token'}
									</Button>
								</div>
							{/if}
						</div>
					</article>
				{/each}
			</section>

			<p class="print-controls mt-6 text-center text-sm text-muted">
				Tip: saat Print, pilih ukuran kertas <strong>A4</strong> dan skala <strong>100%</strong> agar
				kartu benar-benar seukuran KTP.
			</p>
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

	.qr-page :global(h1),
	.qr-page :global(h2),
	.qr-page :global(h3) {
		font-family: var(--font-family-hand);
	}

	.qr-page :global(.font-script) {
		font-family: var(--font-family-script);
	}

	.qr-grid {
		display: grid;
		gap: 1.25rem;
		margin-top: 2rem;
		grid-template-columns: repeat(auto-fill, minmax(19rem, 1fr));
	}

	/* On-screen card keeps the ID-card (KTP) proportions: 85.6 x 54 mm */
	.qr-card {
		display: flex;
		align-items: center;
		gap: 0.9rem;
		aspect-ratio: 85.6 / 54;
		padding: 0.9rem;
		border: 2px dashed var(--gift-color-tan);
		border-radius: var(--gift-radius-md);
		background: var(--gift-color-white);
		box-shadow: var(--gift-shadow-soft);
		break-inside: avoid;
		page-break-inside: avoid;
		animation: qr-card-enter 420ms cubic-bezier(0.22, 1, 0.36, 1) both;
	}

	.qr-card__qr {
		display: grid;
		height: 100%;
		aspect-ratio: 1;
		flex-shrink: 0;
		place-items: center;
		border-radius: var(--gift-radius-sm);
		background: var(--gift-color-white);
	}

	.qr-image {
		width: 100%;
		height: 100%;
		object-fit: contain;
		image-rendering: auto;
	}

	.qr-card__body {
		display: flex;
		min-width: 0;
		flex-direction: column;
		gap: 0.15rem;
	}

	.qr-card__internal {
		color: var(--gift-color-rose-dark);
		font-size: 0.7rem;
		font-weight: 800;
		text-transform: uppercase;
		letter-spacing: 0.12em;
	}

	.qr-card__scan {
		color: var(--gift-color-brown);
		font-size: 1.75rem;
		font-weight: 700;
		line-height: 1.1;
	}

	.qr-card__hint {
		color: var(--gift-color-muted);
		font-size: 0.78rem;
		line-height: 1.25;
	}

	.qr-card__code {
		margin-top: 0.2rem;
		color: var(--gift-color-ink);
		font-size: 0.75rem;
		font-weight: 600;
	}

	.qr-card__code span {
		font-family: 'Courier New', monospace;
		font-weight: 700;
		letter-spacing: 0.03em;
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

		.print-controls {
			display: none !important;
		}

		.qr-grid {
			display: grid;
			grid-template-columns: repeat(2, 85.6mm);
			justify-content: center;
			gap: 10mm 8mm;
			margin: 0;
		}

		.qr-card {
			width: 85.6mm;
			height: 54mm;
			aspect-ratio: auto;
			gap: 4mm;
			padding: 5mm;
			border: 1.2px dashed #b99972;
			border-radius: 4mm;
			box-shadow: none;
			animation: none;
		}

		.qr-card__scan {
			font-size: 20pt;
		}

		.qr-card__hint {
			font-size: 8pt;
		}

		.qr-card__code {
			font-size: 8pt;
		}
	}

	@page {
		size: A4 portrait;
		margin: 14mm;
	}
</style>
