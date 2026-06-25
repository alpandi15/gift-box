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

	async function handleScannedToken(qrToken: string) {
		const validation = validateQrToken(qrToken);

		if (!validation.valid) {
			scanFeedback = getValidationMessage(validation);
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
				return 'Mulai misinya dulu supaya kejutan bisa terbuka satu per satu.';
			default:
				return 'Hmm, QR ini bukan bagian dari misi kita. Coba arahkan kamera ke QR pada hadiah.';
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

<AppShell title="Scan QR Rahasia" background="dark">
	<div class="page-enter flex min-h-[calc(100dvh-3rem)] items-center py-3 sm:py-5">
		<div class="w-full space-y-4">
			<header class="text-center text-white">
				<div class="soft-pulse mx-auto flex size-12 items-center justify-center rounded-full bg-white/12">
					<img class="size-7 brightness-0 invert" src="/assets/icons/qr.svg" alt="" aria-hidden="true" />
				</div>
				<h1 class="mt-4 text-2xl font-extrabold text-white">Arahkan ke QR yang kamu temukan</h1>
				<p class="mt-2 text-sm leading-6 text-white/75">
					Posisikan QR di dalam bingkai dan tahan sebentar.
				</p>
			</header>

			{#if accessAllowed}
				<div class="scanner-frame" class:scanner-frame--success={isProcessing}>
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
				</div>
			{/if}

			{#if scanFeedback}
				<div
					class="rounded-lg border border-white/15 bg-white/10 p-4 text-center text-sm leading-6 text-white"
					role="status"
				>
					{scanFeedback}
				</div>
			{/if}

			{#if cameraError}
				<PaperCard elevated={false}>
					<div class="text-center">
						<h2 class="text-xl font-extrabold text-brown">Kamera belum bisa dibuka</h2>
						<p class="mt-3 text-sm leading-6 text-muted">{cameraError}</p>
						<div class="mt-5">
							<Button fullWidth variant="secondary" onclick={startScanner}>Coba Lagi</Button>
						</div>
					</div>
				</PaperCard>
			{/if}

			<Button href="/clue" variant="ghost" fullWidth class="text-white hover:bg-white/10">
				Kembali ke Petunjuk
			</Button>
		</div>
	</div>
</AppShell>

<style>
	.scanner-frame {
		position: relative;
		overflow: hidden;
		width: 100%;
		aspect-ratio: 3 / 4;
		max-height: 62dvh;
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
			aspect-ratio: 1;
			max-height: 48dvh;
		}
	}
</style>
