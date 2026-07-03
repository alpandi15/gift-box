<script lang="ts">
	interface Props {
		density?: 'low' | 'medium';
		class?: string;
	}

	let { density = 'medium', class: className = '' }: Props = $props();

	// top / left / size(rem) / opacity / delay(s) / anim
	const all = [
		{ top: '6%', left: '4%', size: 1.3, opacity: 0.5, delay: 0, anim: 'gentle-float' },
		{ top: '14%', left: '90%', size: 1.6, opacity: 0.55, delay: 0.6, anim: 'soft-pulse' },
		{ top: '50%', left: '95%', size: 1.1, opacity: 0.4, delay: 1.1, anim: 'gentle-float' },
		{ top: '82%', left: '7%', size: 1.5, opacity: 0.5, delay: 0.3, anim: 'soft-pulse' },
		{ top: '90%', left: '86%', size: 1.2, opacity: 0.45, delay: 0.9, anim: 'gentle-float' },
		{ top: '38%', left: '2%', size: 1.0, opacity: 0.35, delay: 1.4, anim: 'soft-pulse' }
	];

	const hearts = $derived(density === 'low' ? all.slice(0, 3) : all);
</script>

<div class={['hearts-scatter', className].filter(Boolean).join(' ')} aria-hidden="true">
	{#each hearts as h (h.top + h.left)}
		<img
			class="hearts-scatter__heart {h.anim}"
			src="/assets/icons/heart.svg"
			alt=""
			style="top: {h.top}; left: {h.left}; width: {h.size}rem; opacity: {h.opacity}; animation-delay: {h.delay}s;"
		/>
	{/each}
</div>

<style>
	.hearts-scatter {
		position: absolute;
		inset: 0;
		z-index: 0;
		pointer-events: none;
	}

	.hearts-scatter__heart {
		position: absolute;
		transform: translate(-50%, -50%);
		filter: drop-shadow(0 2px 3px rgb(107 63 42 / 12%));
	}
</style>
