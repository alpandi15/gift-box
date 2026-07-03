<script lang="ts">
	import { page } from '$app/state';
	import favicon from '$lib/assets/favicon.svg';
	import { MusicDisc } from '$lib';
	import '../app.css';

	let { children } = $props();

	const gameplayRoutes = new Set(['/', '/clue', '/scan', '/message', '/final']);
	let showMusicDisc = $derived(gameplayRoutes.has(page.url.pathname));
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="stylesheet" href="/assets/design-tokens.css" />
</svelte:head>

{@render children()}

{#if showMusicDisc}
	<MusicDisc />
{/if}
