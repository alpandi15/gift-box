<script lang="ts">
	import PaperCard from './PaperCard.svelte';

	interface Props {
		title?: string;
		message: string;
		illustration?: string;
		note?: string;
	}

	let {
		title = 'Untuk Kamu, dengan Cinta',
		message,
		illustration,
		note
	}: Props = $props();
</script>

<PaperCard icon="/assets/icons/envelope.svg">
	<div class="text-center">
		{#if illustration}
			<div class="mx-auto mb-5 max-w-56 overflow-hidden rounded-lg bg-rose/10 p-2">
				<img
					class="aspect-square w-full object-contain"
					src={illustration}
					alt=""
					aria-hidden="true"
				/>
			</div>
		{/if}

		<h2 class="text-2xl font-extrabold leading-tight text-brown">{title}</h2>

		<div class="relative mt-5 rounded-lg border border-peach/50 bg-white/55 px-5 py-6">
			<img
				class="absolute -top-3 left-1/2 size-7 -translate-x-1/2"
				src="/assets/icons/heart.svg"
				alt=""
				aria-hidden="true"
			/>
			<p class="font-handwritten text-[1.45rem] leading-8 text-ink">{message}</p>
		</div>

		{#if note}
			<p class="mt-4 text-sm italic leading-6 text-muted">{note}</p>
		{/if}
	</div>
</PaperCard>
