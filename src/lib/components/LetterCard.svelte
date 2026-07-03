<script lang="ts">
	import Tape from './Tape.svelte';

	interface Props {
		title?: string;
		message: string;
		signature?: string;
		tilt?: number;
		compact?: boolean;
	}

	let { title, message, signature, tilt = -1, compact = false }: Props = $props();
</script>

<article
	class={['letter', compact ? 'letter--compact' : ''].filter(Boolean).join(' ')}
	style="--letter-tilt: {tilt}deg;"
>
	<Tape color="neutral" position="top-left" rotation={-8} width="4rem" />
	<Tape color="neutral" position="top-right" rotation={7} width="4rem" />

	<div class="letter__holes" aria-hidden="true"></div>

	<div class="letter__body">
		{#if title}
			<h2 class="letter__title font-script">{title}</h2>
		{/if}
		<p class="letter__text font-script">{message}</p>
		{#if signature}
			<p class="letter__sign font-script">{signature}</p>
		{/if}
	</div>
</article>

<style>
	.letter {
		position: relative;
		overflow: hidden;
		padding: 1.25rem 1.25rem 1.5rem 2.4rem;
		border-radius: 0.35rem;
		background-color: #fffdf5;
		/* horizontal ruled lines */
		background-image: repeating-linear-gradient(
			180deg,
			transparent 0,
			transparent calc(1.85rem - 1px),
			rgb(140 111 102 / 22%) calc(1.85rem - 1px),
			rgb(140 111 102 / 22%) 1.85rem
		);
		background-position: 0 1.9rem;
		box-shadow: var(--gift-shadow-card);
		transform: rotate(var(--letter-tilt));
	}

	.letter--compact {
		padding: 1rem 1rem 1.15rem 2.2rem;
	}

	/* red margin line */
	.letter::before {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 1.75rem;
		width: 2px;
		background: rgb(231 126 134 / 45%);
		content: '';
	}

	/* punched holes down the left edge */
	.letter__holes {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0.55rem;
		width: 0.7rem;
		background-image: radial-gradient(
			circle,
			rgb(107 63 42 / 22%) 0 40%,
			transparent 42%
		);
		background-repeat: repeat-y;
		background-size: 0.7rem 2.6rem;
		background-position: center 1.2rem;
	}

	.letter__body {
		position: relative;
	}

	.letter__title {
		margin: 0 0 0.35rem;
		color: var(--gift-color-brown);
		font-size: 1.9rem;
		font-weight: 700;
		line-height: 1.85rem;
	}

	.letter__text {
		margin: 0;
		color: var(--gift-color-ink);
		font-size: 1.45rem;
		font-weight: 500;
		line-height: 1.85rem;
	}

	.letter--compact .letter__text {
		font-size: 1.3rem;
	}

	.letter__sign {
		margin: 0.75rem 0 0;
		color: var(--gift-color-brown);
		font-size: 1.4rem;
		font-weight: 700;
		line-height: 1.85rem;
		text-align: right;
	}

	@media (prefers-reduced-motion: reduce) {
		.letter {
			transform: rotate(var(--letter-tilt));
		}
	}
</style>
