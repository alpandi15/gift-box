<script lang="ts">
	import type { Snippet } from 'svelte';

	type Background = 'warm' | 'paper' | 'dark' | 'final';

	interface Props {
		title?: string;
		background?: Background;
		children: Snippet;
	}

	let { title, background = 'warm', children }: Props = $props();
</script>

<svelte:head>
	{#if title}
		<title>{title}</title>
	{/if}
</svelte:head>

<div class="app-shell" data-background={background}>
	<main class="app-shell__content">
		{@render children()}
	</main>
</div>

<style>
	.app-shell {
		isolation: isolate;
		position: relative;
		min-height: 100dvh;
		overflow-x: clip;
		background-color: var(--gift-color-cream);
		background-position: center;
		background-size: cover;
		color: var(--gift-color-ink);
	}

	.app-shell::before {
		position: fixed;
		z-index: -1;
		inset: 0;
		background: linear-gradient(180deg, rgb(255 255 255 / 20%), rgb(244 166 160 / 8%));
		content: '';
		pointer-events: none;
	}

	.app-shell[data-background='warm'] {
		background-image: url('/assets/backgrounds/warm-cream-bg.webp');
	}

	.app-shell[data-background='paper'] {
		background-image: url('/assets/backgrounds/paper-texture.webp');
	}

	.app-shell[data-background='dark'] {
		background-color: var(--gift-color-dark-unlock);
		background-image: url('/assets/backgrounds/dark-unlock-bg.webp');
		color: var(--gift-color-white);
	}

	.app-shell[data-background='final'] {
		background-image: url('/assets/backgrounds/final-soft-bg.webp');
	}

	.app-shell__content {
		width: min(100%, 28rem);
		min-height: 100dvh;
		margin-inline: auto;
		padding: max(1.25rem, env(safe-area-inset-top)) max(1rem, env(safe-area-inset-right))
			max(1.5rem, env(safe-area-inset-bottom)) max(1rem, env(safe-area-inset-left));
	}

	@media (min-width: 390px) {
		.app-shell__content {
			padding-inline: 1.5rem;
		}
	}
</style>
