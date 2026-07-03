<script lang="ts">
	import Button from './Button.svelte';
	import PaperCard from './PaperCard.svelte';

	interface Props {
		title?: string;
		message?: string;
		actionHref?: string;
		actionLabel?: string;
		showAction?: boolean;
		compact?: boolean;
	}

	let {
		title = 'Eits, belum waktunya 😄',
		message = 'Balik dulu ke petunjuk yang sedang terbuka ya.',
		actionHref = '/clue',
		actionLabel = 'Kembali ke Petunjuk Saat Ini',
		showAction = true,
		compact = false
	}: Props = $props();
</script>

<PaperCard icon="/assets/icons/lock.svg" {compact}>
	<div class="text-center">
		<h2 class="font-hand text-3xl font-bold leading-tight text-brown">{title}</h2>
		<p class="font-body mx-auto mt-3 max-w-sm leading-7 text-muted">{message}</p>

		{#if showAction}
			<div class="mt-6">
				<Button href={actionHref} variant="secondary" fullWidth>
					{actionLabel}
				</Button>
			</div>
		{/if}
	</div>
</PaperCard>
