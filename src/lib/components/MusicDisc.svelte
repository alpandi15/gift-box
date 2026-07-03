<script lang="ts">
	import { initMusic, musicState, toggleMusic } from '$lib/stores/musicStore';
	import { onMount } from 'svelte';

	type Position = 'top-right' | 'top-left';

	interface Props {
		position?: Position;
		compact?: boolean;
	}

	let { position = 'top-right', compact = true }: Props = $props();

	onMount(() => {
		initMusic();
	});

	async function handleToggle() {
		await toggleMusic();
	}
</script>

<button
	type="button"
	class="music-disc"
	class:music-disc--top-right={position === 'top-right'}
	class:music-disc--top-left={position === 'top-left'}
	class:music-disc--compact={compact}
	aria-label={$musicState.isPlaying ? 'Pause music' : 'Play music'}
	title={$musicState.isPlaying ? 'Pause music' : 'Play music'}
	aria-pressed={$musicState.isPlaying}
	onclick={handleToggle}
>
	<span class="music-disc__glow" aria-hidden="true"></span>
	<span
		class="music-disc__vinyl"
		class:music-disc__vinyl--playing={$musicState.isPlaying}
		aria-hidden="true"
	>
		<span class="music-disc__shine"></span>
		<span class="music-disc__center">♥</span>
	</span>
	<span class="music-disc__note" aria-hidden="true">♪</span>
</button>

<style>
	.music-disc {
		position: fixed;
		top: calc(0.75rem + env(safe-area-inset-top));
		z-index: 60;
		display: grid;
		width: 3.25rem;
		height: 3.25rem;
		place-items: center;
		border: 1px solid rgb(255 255 255 / 62%);
		border-radius: 999px;
		background: linear-gradient(145deg, rgb(255 249 240 / 86%), rgb(244 166 160 / 38%));
		box-shadow: 0 14px 28px rgb(107 63 42 / 14%), 0 0 0 6px rgb(255 255 255 / 22%);
		transition: transform 180ms ease, box-shadow 180ms ease, opacity 180ms ease;
		-webkit-tap-highlight-color: transparent;
		backdrop-filter: blur(14px);
	}

	.music-disc--compact {
		width: 2.9rem;
		height: 2.9rem;
	}

	.music-disc--top-right {
		right: max(0.875rem, env(safe-area-inset-right));
	}

	.music-disc--top-left {
		left: max(0.875rem, env(safe-area-inset-left));
	}

	.music-disc:hover,
	.music-disc:active {
		transform: scale(1.05);
		box-shadow: 0 16px 32px rgb(107 63 42 / 18%), 0 0 0 7px rgb(231 126 134 / 14%);
	}

	.music-disc:focus-visible {
		outline: 3px solid var(--gift-color-rose);
		outline-offset: 3px;
	}

	.music-disc__glow {
		position: absolute;
		inset: -0.35rem;
		z-index: -1;
		border-radius: inherit;
		background: radial-gradient(circle, rgb(231 126 134 / 26%), transparent 68%);
		opacity: 0.85;
		pointer-events: none;
	}

	.music-disc__vinyl {
		position: relative;
		display: grid;
		width: 2.25rem;
		height: 2.25rem;
		place-items: center;
		overflow: hidden;
		border: 1px solid rgb(107 63 42 / 16%);
		border-radius: 999px;
		background:
			radial-gradient(circle at center, rgb(255 249 240) 0 18%, transparent 19%),
			radial-gradient(circle at center, transparent 0 36%, rgb(255 255 255 / 42%) 37% 39%, transparent 40%),
			radial-gradient(circle at center, transparent 0 58%, rgb(107 63 42 / 12%) 59% 61%, transparent 62%),
			conic-gradient(from 12deg, #e77e86, #efb66a, #fff6ea, #f4a6a0, #e77e86);
		box-shadow: inset 0 2px 8px rgb(255 255 255 / 42%), inset 0 -4px 10px rgb(107 63 42 / 12%);
	}

	.music-disc__vinyl--playing {
		animation: romantic-disc-spin 3s linear infinite;
	}

	.music-disc__shine {
		position: absolute;
		inset: 0.25rem;
		border-radius: inherit;
		background: linear-gradient(135deg, rgb(255 255 255 / 46%), transparent 42%);
		mix-blend-mode: screen;
		pointer-events: none;
	}

	.music-disc__center {
		position: relative;
		z-index: 1;
		display: grid;
		width: 1rem;
		height: 1rem;
		place-items: center;
		border-radius: 999px;
		background: var(--gift-color-cream-soft);
		color: var(--gift-color-rose-dark);
		font-size: 0.65rem;
		font-weight: 800;
		line-height: 1;
		box-shadow: 0 2px 6px rgb(107 63 42 / 16%);
	}

	.music-disc__note {
		position: absolute;
		right: -0.05rem;
		bottom: -0.1rem;
		display: grid;
		width: 1.05rem;
		height: 1.05rem;
		place-items: center;
		border-radius: 999px;
		background: var(--gift-color-rose);
		color: white;
		font-size: 0.68rem;
		font-weight: 800;
		box-shadow: 0 4px 10px rgb(231 126 134 / 34%);
	}

	@keyframes romantic-disc-spin {
		from {
			transform: rotate(0deg);
		}

		to {
			transform: rotate(360deg);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.music-disc,
		.music-disc__vinyl--playing {
			animation: none;
			transition: none;
		}
	}
</style>
