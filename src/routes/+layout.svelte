<script lang="ts">
	import { page } from '$app/state';
	import favicon from '$lib/assets/favicon.svg';
	import { MusicDisc } from '$lib';
	import '../app.css';

	let { children } = $props();

	const gameplayRoutes = new Set([
		'/',
		'/clue',
		'/scan',
		'/message',
		'/final',
		'/gallery',
		'/messages'
	]);
	let showMusicDisc = $derived(gameplayRoutes.has(page.url.pathname));
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="stylesheet" href="/assets/design-tokens.css" />
</svelte:head>

{@render children()}

{#if showMusicDisc}
	<MusicDisc position="top-left" />
{/if}

<!-- Hidden SVG filter: gives paper cards a rough, hand-torn edge -->
<svg width="0" height="0" aria-hidden="true" focusable="false" style="position:absolute">
	<defs>
		<filter id="paper-torn" x="-6%" y="-6%" width="112%" height="112%">
			<feTurbulence type="fractalNoise" baseFrequency="0.012 0.018" numOctaves="4" seed="7" result="noise" />
			<feDisplacementMap in="SourceGraphic" in2="noise" scale="7" xChannelSelector="R" yChannelSelector="G" />
		</filter>
	</defs>
</svg>
