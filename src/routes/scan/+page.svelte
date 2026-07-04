<script lang="ts">
	import { goto } from '$app/navigation';
	import { AppShell, Button, PaperCard } from '$lib';
	import { canOpenFinal, validateQrToken, type QrTokenValidation } from '$lib/utils/stepGuard';
	import { getHuntState, updateHuntState } from '$lib/utils/storage';
	import type { BrowserQRCodeReader, IScannerControls } from '@zxing/browser';
	import { onDestroy, onMount, tick } from 'svelte';

	let videoElement = $state<HTMLVideoElement>();
	let scannerControls: IScannerControls | null = null;
	let codeReader: BrowserQRCodeReader | null = null;
	let isStarting = $state(true);
	let isProcessing = $state(false);
	let cameraError = $state('');
	let scanFeedback = $state('');
	let accessAllowed = $state(true);

	let showManualInput = $state(false);
	let manualCode = $state('');
	let manualFeedback = $state('');
	let manualInputEl = $state<HTMLInputElement>();

	onMount(async () => {
		const state = getHuntState();

		if (!state.started) {
			await goto('/', { replaceState: true });
			return;
		}

		if (canOpenFinal(state)) {
			await goto('/final', { replaceState: true });
			return;
		}

		await startScanner();
	});

	onDestroy(() => {
		stopScanner();
	});

	async function startScanner() {
		stopScanner();
		cameraError = '';
		scanFeedback = '';
		isStarting = true;
		accessAllowed = true;

		if (!navigator.mediaDevices?.getUserMedia) {
			cameraError =
				'Kamera belum tersedia di browser ini. Coba buka web lewat HTTPS dan gunakan browser terbaru.';
			accessAllowed = false;
			isStarting = false;
			return;
		}

		try {
			const { BrowserQRCodeReader } = await import('@zxing/browser');
			await tick();
			codeReader = new BrowserQRCodeReader(undefined, {
				delayBetweenScanAttempts: 250,
				delayBetweenScanSuccess: 1000
			});

			scannerControls = await codeReader.decodeFromConstraints(
				{
					audio: false,
					video: {
						facingMode: { ideal: 'environment' },
						width: { ideal: 1280 },
						height: { ideal: 720 }
					}
				},
				videoElement,
				(result) => {
					if (!result || isProcessing) return;
					void handleScannedToken(result.getText());
				}
			);
		} catch (error) {
			cameraError = getCameraErrorMessage(error);
			accessAllowed = false;
		} finally {
			isStarting = false;
		}
	}

	async function processToken(qrToken: string, onInvalid: (message: string) => void) {
		const validation = validateQrToken(qrToken);

		if (!validation.valid) {
			onInvalid(getValidationMessage(validation));
			return;
		}

		isProcessing = true;
		scanFeedback = 'Ketemu! Membuka pesan kecil untukmu...';
		stopScanner();

		const { step } = validation;

		updateHuntState((state) => ({
			...state,
			currentStep: step.nextStep ?? state.currentStep,
			foundSteps: [...new Set([...state.foundSteps, step.id])],
			lastUnlockedMessageStep: step.id,
			finalUnlocked: state.finalUnlocked || step.isFinalTrigger
		}));

		await goto('/message');
	}

	async function handleScannedToken(qrToken: string) {
		await processToken(qrToken, (message) => {
			scanFeedback = message;
		});
	}

	async function openManualInput() {
		showManualInput = true;
		manualFeedback = '';
		await tick();
		manualInputEl?.focus();
	}

	function closeManualInput() {
		showManualInput = false;
		manualCode = '';
		manualFeedback = '';
	}

	async function submitManualCode(event?: Event) {
		event?.preventDefault();
		const code = manualCode.trim();

		if (!code) {
			manualFeedback = 'Tulis dulu kodenya, ya 😊';
			return;
		}

		await processToken(code, (message) => {
			manualFeedback = message;
		});
	}

	function stopScanner() {
		scannerControls?.stop();
		scannerControls = null;

		if (
			typeof MediaStream !== 'undefined' &&
			videoElement?.srcObject instanceof MediaStream
		) {
			for (const track of videoElement.srcObject.getTracks()) {
				track.stop();
			}
			videoElement.srcObject = null;
		}

		codeReader = null;
	}

	function getValidationMessage(validation: Exclude<QrTokenValidation, { valid: true }>): string {
		switch (validation.reason) {
			case 'already-found':
				return 'QR ini sudah pernah kamu buka. Cari QR dari petunjuk yang sedang aktif, ya 💌';
			case 'wrong-step':
				return 'Eits, QR ini belum waktunya dibuka 😄 Ikuti petunjuk yang sedang aktif dulu, ya.';
			case 'not-started':
				return 'Mulai perjalanannya dulu supaya catatannya bisa terbuka satu per satu.';
			default:
				return 'Hmm, QR ini bukan bagian dari perjalanan kita. Coba arahkan kamera ke QR dari petunjuk yang sedang aktif.';
		}
	}

	function getCameraErrorMessage(error: unknown): string {
		if (error instanceof DOMException) {
			if (error.name === 'NotAllowedError' || error.name === 'SecurityError') {
				return 'Izin kamera belum diberikan. Izinkan akses kamera di browser, lalu coba lagi.';
			}

			if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
				return 'Kamera tidak ditemukan di perangkat ini.';
			}

			if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
				return 'Kamera sedang dipakai aplikasi lain. Tutup aplikasi tersebut, lalu coba lagi.';
			}
		}

		return 'Kamera belum berhasil dibuka. Pastikan izin kamera aktif dan halaman menggunakan HTTPS.';
	}
</script>

<svelte:window
	onkeydown={(event) => {
		if (event.key === 'Escape' && showManualInput) closeManualInput();
	}}
/>

<AppShell title="Scan QR Rahasia" background="dark" compact bottomSlot>
	{#snippet bottom()}
		<div class="bottom-panel">
			<Button fullWidth variant="secondary" onclick={openManualInput}>
				<img class="size-5" src="/assets/icons/qr.svg" alt="" aria-hidden="true" />
				Tidak bisa scan? Masukkan kode
			</Button>
			<div class="mt-1 text-center">
				<Button href="/clue" variant="ghost" size="sm" class="text-white hover:bg-white/10">
					Kembali ke Petunjuk
				</Button>
			</div>
		</div>
	{/snippet}

	<div class="page-enter flex h-full min-h-0 flex-col gap-3">
		<header class="shrink-0 text-center text-white">
			<div class="soft-pulse mx-auto flex size-10 items-center justify-center rounded-full bg-white/12">
				<img class="size-6 brightness-0 invert" src="/assets/icons/qr.svg" alt="" aria-hidden="true" />
			</div>
			<h1 class="mt-2 text-xl font-extrabold text-white min-[390px]:text-2xl">
				Arahkan ke QR yang kamu temukan
			</h1>
			<p class="mt-1 text-xs leading-5 text-white/75 min-[390px]:text-sm">
				Posisikan QR di dalam bingkai dan tahan sebentar.
			</p>
		</header>

		{#if accessAllowed}
			<div class="scanner-frame min-h-0 flex-1" class:scanner-frame--success={isProcessing}>
				<video
					bind:this={videoElement}
					class="h-full w-full object-cover"
					autoplay
					muted
					playsinline
					aria-label="Pratinjau kamera untuk memindai QR"
				></video>
				<div class="scanner-corners" aria-hidden="true"></div>

				{#if isStarting}
					<div class="absolute inset-0 grid place-items-center bg-dark-unlock/75">
						<p class="text-sm font-semibold text-white">Membuka kamera...</p>
					</div>
				{/if}

				{#if scanFeedback}
					<div
						class="absolute inset-x-3 bottom-3 rounded-lg border border-white/15 bg-dark-unlock/85 p-3 text-center text-xs leading-5 text-white backdrop-blur-sm"
						role="status"
					>
						{scanFeedback}
					</div>
				{/if}
			</div>
		{:else if cameraError}
			<div class="flex min-h-0 flex-1 items-center">
				<PaperCard elevated={false} compact class="w-full">
					<div class="text-center">
						<h2 class="text-xl font-extrabold text-brown">Kamera belum bisa dibuka</h2>
						<p class="mt-2 text-sm leading-6 text-muted">{cameraError}</p>
						<div class="mt-4 space-y-2">
							<Button fullWidth onclick={openManualInput}>Masukkan Kode Manual</Button>
							<Button fullWidth variant="secondary" onclick={startScanner}>Coba Lagi</Button>
						</div>
					</div>
				</PaperCard>
			</div>
		{/if}
	</div>

	{#if showManualInput}
		<div
			class="manual-overlay"
			role="dialog"
			aria-modal="true"
			aria-label="Masukkan kode secara manual"
		>
			<button type="button" class="manual-overlay__backdrop" aria-label="Tutup" onclick={closeManualInput}
			></button>

			<div class="manual-sheet">
				<PaperCard compact torn tape="peach" class="w-full">
					<div class="text-center">
						<h2 class="font-script text-3xl font-bold text-brown">Masukkan Kode</h2>
						<p class="mt-1 text-sm leading-6 text-muted">
							Kameranya tidak mau bekerja? Ketik saja kode yang tertera di dekat QR-nya.
						</p>

						<form class="mt-4 text-left" onsubmit={submitManualCode}>
							<label class="text-xs font-bold uppercase tracking-[0.12em] text-rose-dark" for="manual-code">
								Kode Petunjuk
							</label>
							<input
								bind:this={manualInputEl}
								bind:value={manualCode}
								id="manual-code"
								class="manual-input mt-1"
								type="text"
								inputmode="text"
								autocomplete="off"
								autocapitalize="characters"
								spellcheck="false"
								placeholder="Contoh: CATATAN-1"
								oninput={() => (manualFeedback = '')}
							/>

							{#if manualFeedback}
								<p class="mt-2 text-sm leading-5 text-rose-dark" role="status">{manualFeedback}</p>
							{/if}

							<div class="mt-4 space-y-2">
								<Button type="submit" fullWidth>Buka Pesan</Button>
								<Button type="button" variant="ghost" fullWidth onclick={closeManualInput}>
									Batal
								</Button>
							</div>
						</form>
					</div>
				</PaperCard>
			</div>
		</div>
	{/if}
</AppShell>

<style>
	.scanner-frame {
		position: relative;
		overflow: hidden;
		width: 100%;
		min-height: 10rem;
		border: 1px solid rgb(255 255 255 / 20%);
		border-radius: var(--gift-radius-lg);
		background: #171616;
		box-shadow: 0 20px 50px rgb(0 0 0 / 28%);
		transition:
			border-color 200ms ease,
			box-shadow 200ms ease;
	}

	.scanner-frame--success {
		border-color: var(--gift-color-success);
		box-shadow: 0 0 0 4px rgb(148 182 126 / 20%);
	}

	.scanner-corners {
		position: absolute;
		inset: 16%;
		border: 3px solid transparent;
		background:
			linear-gradient(var(--gift-color-white), var(--gift-color-white)) left top / 2.5rem 3px
				no-repeat,
			linear-gradient(var(--gift-color-white), var(--gift-color-white)) left top / 3px 2.5rem
				no-repeat,
			linear-gradient(var(--gift-color-white), var(--gift-color-white)) right top / 2.5rem 3px
				no-repeat,
			linear-gradient(var(--gift-color-white), var(--gift-color-white)) right top / 3px 2.5rem
				no-repeat,
			linear-gradient(var(--gift-color-white), var(--gift-color-white)) left bottom / 2.5rem 3px
				no-repeat,
			linear-gradient(var(--gift-color-white), var(--gift-color-white)) left bottom / 3px 2.5rem
				no-repeat,
			linear-gradient(var(--gift-color-white), var(--gift-color-white)) right bottom / 2.5rem 3px
				no-repeat,
			linear-gradient(var(--gift-color-white), var(--gift-color-white)) right bottom / 3px 2.5rem
				no-repeat;
		pointer-events: none;
	}

	@media (max-height: 680px) {
		.scanner-frame {
			min-height: 8rem;
		}
	}

	.manual-overlay {
		position: fixed;
		inset: 0;
		z-index: 50;
		display: grid;
		place-items: center;
		padding: 1.25rem;
		animation: manual-fade 180ms ease both;
	}

	.manual-overlay__backdrop {
		position: absolute;
		inset: 0;
		border: 0;
		background: rgb(23 22 22 / 68%);
		backdrop-filter: blur(3px);
		cursor: pointer;
	}

	.manual-sheet {
		position: relative;
		z-index: 1;
		width: min(100%, 24rem);
		animation: manual-pop 220ms cubic-bezier(0.22, 1, 0.36, 1) both;
	}

	.manual-input {
		width: 100%;
		border: 2px solid var(--gift-color-tan);
		border-radius: var(--gift-radius-sm);
		background: var(--gift-color-white);
		padding: 0.75rem 1rem;
		color: var(--gift-color-ink);
		font-family: var(--font-family-sans);
		font-size: 1.05rem;
		font-weight: 700;
		letter-spacing: 0.04em;
		text-transform: uppercase;
	}

	.manual-input::placeholder {
		color: var(--gift-color-muted);
		font-weight: 500;
		letter-spacing: normal;
		text-transform: none;
	}

	.manual-input:focus-visible {
		border-color: var(--gift-color-rose);
		outline: none;
		box-shadow: 0 0 0 3px rgb(231 126 134 / 22%);
	}

	@keyframes manual-fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@keyframes manual-pop {
		from {
			opacity: 0;
			transform: translateY(0.75rem) scale(0.98);
		}
		to {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.manual-overlay,
		.manual-sheet {
			animation: none;
		}
	}
</style>
