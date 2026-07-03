<script lang="ts">
	import PaperCard from './PaperCard.svelte';
	import TapeLabel from './TapeLabel.svelte';

	interface Props {
		title?: string;
		clue: string | string[];
		illustration?: string;
		illustrationAlt?: string;
		eyebrow?: string;
		compact?: boolean;
	}

	let {
		title = 'Sebuah Petunjuk Untukmu',
		clue,
		illustration,
		illustrationAlt = '',
		eyebrow = 'Petunjuk terbuka',
		compact = false
	}: Props = $props();

	let activeClue = $state(0);
	let clues = $derived(Array.isArray(clue) ? clue : [clue]);

	$effect(() => {
		clues;
		activeClue = 0;
	});
</script>

<PaperCard {compact} torn tilt={-1} class={compact ? 'h-full' : ''}>
	<div class="text-center">
		<TapeLabel text={eyebrow} color="purple" icon="/assets/icons/sparkle.svg" />

		{#if illustration}
			<div
				class="mx-auto overflow-hidden rounded-lg bg-peach/10 p-1.5"
				class:mt-3={compact}
				class:max-w-36={compact}
				class:mt-4={!compact}
				class:max-w-64={!compact}
			>
				<img
					class="aspect-square w-full object-contain"
					src={illustration}
					alt={illustrationAlt}
					aria-hidden={illustrationAlt ? undefined : 'true'}
				/>
			</div>
		{/if}

		<h2
			class="font-script font-bold leading-tight text-brown"
			class:mt-3={compact}
			class:text-3xl={compact}
			class:mt-5={!compact}
			class:text-4xl={!compact}
		>
			{title}
		</h2>
		<p
			class="font-body mx-auto max-w-sm text-ink"
			class:mt-2={compact}
			class:text-base={compact}
			class:leading-7={compact}
			class:mt-4={!compact}
			class:text-lg={!compact}
			class:leading-8={!compact}
		>
			“{clues[activeClue]}”
		</p>

		{#if clues.length > 1}
			<div class="mt-3 flex items-center justify-center gap-3">
				<button
					type="button"
					class="rounded-full px-3 py-2 text-sm font-bold text-rose-dark disabled:opacity-35"
					disabled={activeClue === 0}
					onclick={() => (activeClue -= 1)}
				>
					Sebelumnya
				</button>
				<button
					type="button"
					class="rounded-full px-3 py-2 text-sm font-bold text-rose-dark disabled:opacity-35"
					disabled={activeClue === clues.length - 1}
					onclick={() => (activeClue += 1)}
				>
					Berikutnya
				</button>
			</div>
		{:else if !compact}
			<div class="mx-auto mt-5 flex w-fit items-center gap-2 text-sm font-semibold text-muted">
				<span class="h-px w-8 bg-tan"></span>
				<span>Ikuti kata hatimu</span>
				<span class="h-px w-8 bg-tan"></span>
			</div>
		{/if}
	</div>
</PaperCard>
