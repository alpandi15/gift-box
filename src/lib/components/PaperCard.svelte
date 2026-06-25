<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title?: string;
		subtitle?: string;
		icon?: string;
		elevated?: boolean;
		class?: string;
		children: Snippet;
	}

	let {
		title,
		subtitle,
		icon,
		elevated = true,
		class: className = '',
		children
	}: Props = $props();
</script>

<section
	class={[
		'paper-card relative overflow-hidden rounded-xl border border-white/70 bg-cream-soft/95 p-5 sm:p-6',
		elevated ? 'shadow-card' : 'shadow-soft',
		className
	]
		.filter(Boolean)
		.join(' ')}
>
	<div class="paper-card__texture" aria-hidden="true"></div>

	<div class="relative z-10">
		{#if icon || title || subtitle}
			<header class="mb-5 text-center">
				{#if icon}
					<div
						class="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-peach/20"
					>
						<img class="size-6" src={icon} alt="" aria-hidden="true" />
					</div>
				{/if}

				{#if title}
					<h2 class="text-xl font-extrabold text-brown sm:text-2xl">{title}</h2>
				{/if}

				{#if subtitle}
					<p class="mt-2 text-sm leading-6 text-muted">{subtitle}</p>
				{/if}
			</header>
		{/if}

		{@render children()}
	</div>
</section>

<style>
	.paper-card {
		transform: translateZ(0);
	}

	.paper-card__texture {
		position: absolute;
		inset: 0;
		background-image: url('/assets/backgrounds/paper-texture.webp');
		background-position: center;
		background-size: cover;
		opacity: 0.12;
		pointer-events: none;
	}
</style>
