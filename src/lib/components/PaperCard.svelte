<script lang="ts">
	import type { Snippet } from 'svelte';
	import Tape from './Tape.svelte';

	type TapeColor = 'none' | 'neutral' | 'peach' | 'purple';
	type TapePosition = 'top-center' | 'top-left' | 'top-right';

	interface Props {
		title?: string;
		subtitle?: string;
		icon?: string;
		elevated?: boolean;
		compact?: boolean;
		torn?: boolean;
		tilt?: number;
		tape?: TapeColor;
		tapePosition?: TapePosition;
		class?: string;
		children: Snippet;
	}

	let {
		title,
		subtitle,
		icon,
		elevated = true,
		compact = false,
		torn = false,
		tilt = 0,
		tape = 'none',
		tapePosition = 'top-center',
		class: className = '',
		children
	}: Props = $props();
</script>

<section
	class={[
		'paper-card relative rounded-xl',
		torn ? 'paper-card--torn' : 'overflow-hidden',
		compact ? 'p-4' : 'p-5 sm:p-6',
		elevated ? 'shadow-card' : 'shadow-soft',
		className
	]
		.filter(Boolean)
		.join(' ')}
	style="--tilt: {tilt}deg;"
>
	<div class="paper-card__backing" class:paper-card__backing--torn={torn} aria-hidden="true">
		<div class="paper-card__texture"></div>
	</div>

	{#if tape !== 'none'}
		<Tape color={tape} position={tapePosition} />
	{/if}

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
		transform: rotate(var(--tilt, 0deg)) translateZ(0);
		animation: paper-card-enter 480ms cubic-bezier(0.22, 1, 0.36, 1) both;
	}

	/* Filled paper backing sits behind the content so the torn edge only
	   distorts the paper shape, never the text on top of it. */
	.paper-card__backing {
		position: absolute;
		inset: 0;
		overflow: hidden;
		border: 1px solid rgb(255 255 255 / 70%);
		border-radius: inherit;
		background: color-mix(in srgb, var(--gift-color-cream-soft) 95%, transparent);
	}

	.paper-card__backing--torn {
		border-radius: 0.4rem;
		filter: url(#paper-torn);
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
			transform: rotate(var(--tilt, 0deg)) translateY(0.75rem);
		}

		to {
			opacity: 1;
			transform: rotate(var(--tilt, 0deg)) translateY(0);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.paper-card {
			animation: none;
			transform: rotate(var(--tilt, 0deg));
		}
	}
</style>
