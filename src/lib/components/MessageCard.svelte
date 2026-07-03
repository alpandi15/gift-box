<script lang="ts">
	import PaperCard from './PaperCard.svelte';
	import TapeLabel from './TapeLabel.svelte';

	interface Props {
		title?: string;
		message: string;
		illustration?: string;
		illustrationAlt?: string;
		note?: string;
		label?: string;
		compact?: boolean;
	}

	let {
		title = 'Untuk Kamu, dengan Cinta',
		message,
		illustration,
		illustrationAlt = '',
		note,
		label = 'Pesan Untukmu',
		compact = false
	}: Props = $props();
</script>

<PaperCard icon={compact ? undefined : '/assets/icons/envelope.svg'} {compact} torn tilt={1} class={compact ? 'h-full' : ''}>
	<div class="text-center">
		<TapeLabel text={label} color="peach" icon="/assets/icons/heart.svg" />

		{#if illustration}
			<div
				class="message-illustration mx-auto overflow-hidden rounded-lg bg-rose/10 p-1.5"
				class:mb-2={compact}
				class:max-w-24={compact}
				class:mb-5={!compact}
				class:max-w-56={!compact}
			>
				<img
					class="aspect-square w-full object-contain"
					src={illustration}
					alt={illustrationAlt}
					aria-hidden={illustrationAlt ? undefined : 'true'}
				/>
			</div>
		{/if}

		<h2 class="font-script font-bold leading-tight text-brown" class:text-3xl={compact} class:text-4xl={!compact}>
			{title}
		</h2>

		<div
			class="relative rounded-lg border border-peach/50 bg-white/55"
				class:mt-2={compact}
				class:px-4={compact}
				class:py-3={compact}
			class:mt-5={!compact}
			class:px-5={!compact}
			class:py-6={!compact}
		>
			<img
				class="soft-pulse absolute -top-3 left-1/2 size-7 -translate-x-1/2"
				src="/assets/icons/heart.svg"
				alt=""
				aria-hidden="true"
			/>
			<p
				class="font-script text-ink"
				class:text-xl={compact}
				class:leading-7={compact}
				class:text-2xl={!compact}
				class:leading-8={!compact}
			>
				{message}
			</p>
		</div>

		{#if note}
			<p class="font-body message-note italic text-muted" class:mt-2={compact} class:text-xs={compact} class:leading-5={compact} class:mt-4={!compact} class:text-sm={!compact} class:leading-6={!compact}>
				{note}
			</p>
		{/if}
	</div>
</PaperCard>

<style>
	@media (max-height: 560px) {
		.message-illustration,
		.message-note {
			display: none;
		}
	}
</style>
