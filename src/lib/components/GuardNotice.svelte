<script lang="ts">
	import Button from './Button.svelte';
	import PaperCard from './PaperCard.svelte';

	interface Props {
		title?: string;
		message?: string;
		actionHref?: string;
		actionLabel?: string;
	}

	let {
		title = 'Eits, belum waktunya 😄',
		message = 'Balik dulu ke petunjuk yang sedang terbuka ya.',
		actionHref = '/clue',
		actionLabel = 'Kembali ke Petunjuk Saat Ini'
	}: Props = $props();
</script>

<PaperCard icon="/assets/icons/lock.svg">
	<div class="text-center">
		<h2 class="text-2xl font-extrabold leading-tight text-brown">{title}</h2>
		<p class="mx-auto mt-3 max-w-sm leading-7 text-muted">{message}</p>

		<div class="mt-6">
			<Button href={actionHref} variant="secondary" fullWidth>
				{actionLabel}
			</Button>
		</div>
	</div>
</PaperCard>
