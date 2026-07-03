<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title?: string;
		subtitle?: string;
		icon?: string;
		elevated?: boolean;
		compact?: boolean;
		class?: string;
		children: Snippet;
	}

	let {
		title,
		subtitle,
		icon,
		elevated = true,
		compact = false,
		class: className = '',
		children
	}: Props = $props();
</script>

<section
	class={[
		'paper-card relative overflow-hidden rounded-xl border border-white/70 bg-cream-soft/95',
		compact ? 'p-4' : 'p-5 sm:p-6',
		elevated ? 'shadow-card' : 'shadow-soft',
		className
	]
		.filter(Boolean)
		.join(' ')}
>
	<div class="paper-card__texture" aria-hidden="true"></div>

	<div class="relative z-10">
		{#if icon || title || subtitle}
			<header class="text-center" class:mb-3={compact} class:mb-5={!compact}>
				{#if icon}
					<div
						class="mx-auto flex items-center justify-center rounded-full bg-peach/20"
						class:mb-2={compact}
						class:size-10={compact}
						class:mb-3={!compact}
						class:size-12={!compact}
					>
						<img class:size-5={compact} class:size-6={!compact} src={icon} alt="" aria-hidden="true" />
					</div>
				{/if}

				{#if title}
					<h2 class="font-hand text-2xl font-bold leading-tight text-brown sm:text-3xl">{title}</h2>
				{/if}

				{#if subtitle}
					<p class="font-body mt-2 text-sm leading-6 text-muted">{subtitle}</p>
				{/if}
			</header>
		{/if}

		{@render children()}
	</div>
</section>

<style>
	.paper-card {
		transform: translateZ(0);
		animation: paper-card-enter 480ms cubic-bezier(0.22, 1, 0.36, 1) both;
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

	@keyframes paper-card-enter {
		from {
			opacity: 0;
			transform: translateY(0.75rem);
		}

		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.paper-card {
			animation: none;
		}
	}
</style>
