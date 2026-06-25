<script lang="ts">
	import PaperCard from './PaperCard.svelte';

	interface Props {
		title?: string;
		clue: string;
		illustration?: string;
		illustrationAlt?: string;
		eyebrow?: string;
	}

	let {
		title = 'Sebuah Petunjuk Untukmu',
		clue,
		illustration,
		illustrationAlt = '',
		eyebrow = 'Petunjuk terbuka'
	}: Props = $props();
</script>

<PaperCard>
	<div class="text-center">
		<div
			class="inline-flex items-center gap-2 rounded-full bg-purple/12 px-3 py-2 text-xs font-extrabold uppercase tracking-[0.14em] text-brown"
		>
			<img class="soft-pulse size-4" src="/assets/icons/sparkle.svg" alt="" aria-hidden="true" />
			<span>{eyebrow}</span>
		</div>

		{#if illustration}
			<div class="mx-auto mt-4 max-w-64 overflow-hidden rounded-lg bg-peach/10 p-2">
				<img
					class="aspect-square w-full object-contain"
					src={illustration}
					alt={illustrationAlt}
					aria-hidden={illustrationAlt ? undefined : 'true'}
				/>
			</div>
		{/if}

		<h2 class="mt-5 text-2xl font-extrabold leading-tight text-brown">{title}</h2>
		<p class="mx-auto mt-4 max-w-sm font-handwritten text-[1.55rem] leading-9 text-ink">
			“{clue}”
		</p>

		<div class="mx-auto mt-5 flex w-fit items-center gap-2 text-sm font-semibold text-muted">
			<span class="h-px w-8 bg-tan"></span>
			<span>Ikuti kata hatimu</span>
			<span class="h-px w-8 bg-tan"></span>
		</div>
	</div>
</PaperCard>
