<script lang="ts">
	import type { Snippet } from 'svelte';

	type Background = 'warm' | 'paper' | 'dark' | 'final';

	interface Props {
		title?: string;
		background?: Background;
		compact?: boolean;
		bottomSlot?: boolean;
		children: Snippet;
		bottom?: Snippet;
	}

	let {
		title,
		background = 'warm',
		compact = false,
		bottomSlot = false,
		children,
		bottom
	}: Props = $props();
</script>

<svelte:head>
	{#if title}
		<title>{title}</title>
	{/if}
</svelte:head>

<div class="app-shell" class:app-shell--compact={compact} data-background={background}>
	<div class="app-shell__viewport">
		<main
			class="app-shell__content"
			class:app-shell__content--compact={compact}
			class:app-shell__content--with-bottom={compact && (bottomSlot || bottom)}
		>
			{@render children()}
		</main>

		{#if bottom}
			<footer class="app-shell__bottom">
				{@render bottom()}
			</footer>
		{/if}
	</div>
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

	.app-shell--compact {
		height: 100dvh;
		min-height: 0;
		overflow: hidden;
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

	.app-shell__viewport {
		width: min(100%, 28rem);
		min-height: 100dvh;
		margin-inline: auto;
	}

	.app-shell--compact .app-shell__viewport {
		display: grid;
		height: 100dvh;
		min-height: 0;
		grid-template-rows: minmax(0, 1fr) auto;
		overflow: hidden;
	}

	.app-shell__content {
		padding: max(1.25rem, env(safe-area-inset-top)) max(1rem, env(safe-area-inset-right))
			calc(1.5rem + env(safe-area-inset-bottom)) max(1rem, env(safe-area-inset-left));
	}

	.app-shell__content--compact {
		min-height: 0;
		overflow: hidden;
		padding: max(0.75rem, env(safe-area-inset-top)) max(1rem, env(safe-area-inset-right))
			0 max(1rem, env(safe-area-inset-left));
	}

	.app-shell__content--compact:not(.app-shell__content--with-bottom) {
		padding-bottom: calc(0.75rem + env(safe-area-inset-bottom));
	}

	.app-shell__bottom {
		z-index: 20;
		padding: 0 max(1rem, env(safe-area-inset-right))
			calc(1rem + env(safe-area-inset-bottom)) max(1rem, env(safe-area-inset-left));
		background: linear-gradient(180deg, transparent, var(--shell-bottom-color) 24%);
	}

	.app-shell[data-background='warm'],
	.app-shell[data-background='paper'],
	.app-shell[data-background='final'] {
		--shell-bottom-color: rgb(255 246 234 / 96%);
	}

	.app-shell[data-background='dark'] {
		--shell-bottom-color: rgb(47 45 45 / 98%);
	}

	.app-shell__bottom :global(.bottom-panel) {
		border: 1px solid rgb(255 255 255 / 55%);
		border-radius: var(--gift-radius-lg);
		background: rgb(255 255 255 / 68%);
		padding: 0.75rem;
		box-shadow: var(--gift-shadow-soft);
		backdrop-filter: blur(14px);
	}

	.app-shell[data-background='dark'] .app-shell__bottom :global(.bottom-panel) {
		border-color: rgb(255 255 255 / 12%);
		background: rgb(255 255 255 / 8%);
	}

	@media (min-width: 390px) {
		.app-shell__content {
			padding-inline: 1.5rem;
		}

		.app-shell__bottom {
			padding-inline: 1.5rem;
		}
	}

	@media (max-height: 680px) {
		.app-shell__content--compact {
			padding-top: max(0.5rem, env(safe-area-inset-top));
		}

		.app-shell__bottom {
			padding-bottom: calc(0.625rem + env(safe-area-inset-bottom));
		}
	}
</style>
