<script lang="ts">
	import Button from './Button.svelte';
	import PaperCard from './PaperCard.svelte';

	interface Props {
		title?: string;
		message?: string;
		href?: string;
		ctaLabel?: string;
	}

	let {
		title = 'Petunjuk baru terbuka ✨',
		message = 'Baca pelan-pelan, lalu lanjutkan misinya.',
		href = '/clue',
		ctaLabel = 'Buka Petunjuk Berikutnya'
	}: Props = $props();
</script>

<PaperCard class="border-purple/20 bg-cream-soft">
	<div class="text-center">
		<div
			class="gentle-float mx-auto flex size-16 items-center justify-center rounded-full bg-purple/15 shadow-soft"
		>
			<img class="size-9" src="/assets/icons/unlock.svg" alt="" aria-hidden="true" />
		</div>

		<h2 class="mt-4 text-2xl font-extrabold leading-tight text-brown">{title}</h2>
		<p class="mx-auto mt-3 max-w-sm leading-7 text-muted">{message}</p>

		<div class="mt-6">
			<Button {href} fullWidth>
				{ctaLabel}
			</Button>
		</div>
	</div>
</PaperCard>
