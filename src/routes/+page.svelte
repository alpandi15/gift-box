<script lang="ts">
	import { goto } from '$app/navigation';
	import { AppShell, Button, PaperCard } from '$lib';
	import { giftStepIds } from '$lib/data/giftSteps';
	import { getHuntState, updateHuntState } from '$lib/utils/storage';
	import { onMount } from 'svelte';

	let hasStarted = $state(false);
	let isReady = $state(false);
	let isNavigating = $state(false);

	onMount(() => {
		hasStarted = getHuntState().started;
		isReady = true;
	});

	async function startMission() {
		if (isNavigating) return;

		isNavigating = true;

		updateHuntState((state) => ({
			...state,
			started: true,
			currentStep: state.started ? state.currentStep : giftStepIds[0],
			foundSteps: state.foundSteps ?? []
		}));

		await goto('/clue');
	}
</script>

<AppShell title="Birthday Gift Hunt" background="warm">
	<div class="flex min-h-[calc(100dvh-3rem)] items-center py-6">
		<PaperCard class="w-full">
			<div class="text-center">
				<div class="mx-auto max-w-72">
					<img
						class="aspect-square w-full object-contain"
						src="/assets/illustrations/opening-room.webp"
						alt=""
						aria-hidden="true"
					/>
				</div>

				<div class="mx-auto -mt-3 flex size-12 items-center justify-center rounded-full bg-rose/15">
					<img class="size-7" src="/assets/icons/heart.svg" alt="" aria-hidden="true" />
				</div>

				<h1 class="mt-4 text-3xl font-extrabold leading-tight text-brown">
					Selamat ulang tahun, sayang ❤️
				</h1>

				<p class="mx-auto mt-4 max-w-sm leading-7 text-muted">
					Ada sesuatu yang aku siapkan untukmu. Tapi kamu harus menemukannya pelan-pelan.
					Ikuti petunjuknya, jangan lompat, dan nikmati perjalanannya.
				</p>

				<div class="mt-7">
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
				</div>

				<p class="mt-4 text-xs leading-5 text-muted">
					Disiapkan dengan cinta, khusus untuk hari istimewamu.
				</p>
			</div>
		</PaperCard>
	</div>
</AppShell>
