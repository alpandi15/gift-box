<script lang="ts">
	import { goto } from '$app/navigation';
	import { AppShell, Button, HeartsScatter, PaperCard, Polaroid } from '$lib';
	import { giftStepIds } from '$lib/data/giftSteps';
	import { playMusic } from '$lib/stores/musicStore';
	import { getHuntState, resetHuntState, updateHuntState } from '$lib/utils/storage';
	import { onMount } from 'svelte';

	let hasStarted = $state(false);
	let isReady = $state(false);
	let isNavigating = $state(false);
	let isResetting = $state(false);

	onMount(() => {
		hasStarted = getHuntState().started;
		isReady = true;
	});

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

<AppShell title="Birthday Gift Hunt" background="warm" compact bottomSlot>
	{#snippet bottom()}
		<div class="bottom-panel">
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
						alt="Ilustrasi ruangan hangat dengan hadiah ulang tahun"
					/>
				</div>

				<div class="soft-pulse mx-auto -mt-2 flex size-10 items-center justify-center rounded-full bg-rose/15">
					<img class="size-6" src="/assets/icons/heart.svg" alt="" aria-hidden="true" />
				</div>

				<h1 class="font-script mt-3 text-4xl font-bold leading-tight text-brown min-[390px]:text-5xl">
					Selamat ulang tahun, sayangku Ella Adelia ❤️
				</h1>

				<p class="font-body mx-auto mt-3 max-w-sm text-sm leading-6 text-muted min-[390px]:text-base">
					Ada sesuatu yang aku siapkan untukmu. Tapi kamu harus menemukannya pelan-pelan.
					Ikuti petunjuknya, jangan lompat, dan nikmati perjalanannya.
				</p>

				<p class="font-body mt-3 text-xs leading-5 text-muted">
					Disiapkan dengan cinta, khusus untuk hari istimewamu.
				</p>
			</div>
		</PaperCard>
	</div>
</AppShell>

<style>
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
