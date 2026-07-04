<script lang="ts">
	interface Props {
		side?: 'left' | 'right';
		width?: string;
	}

	let { side = 'left', width = '6.25rem' }: Props = $props();
</script>

<div class={`wife-character wife-character--${side}`} style="--wife-width: {width};" aria-hidden="true">
	<div class="wife-character__flip">
		<img class="wife-character__img" src="/assets/illustrations/character.png" alt="" />
	</div>
</div>

<style>
	.wife-character {
		position: absolute;
		bottom: -0.75rem;
		z-index: 40;
		width: var(--wife-width);
		pointer-events: none;
		filter: drop-shadow(0 8px 14px rgb(107 63 42 / 22%));
		animation: wife-rise 760ms cubic-bezier(0.22, 1, 0.36, 1) 180ms both;
	}

	.wife-character--left {
		left: -1.75rem;
	}

	.wife-character--right {
		right: -1.75rem;
	}

	.wife-character__flip {
		width: 100%;
	}

	.wife-character__img {
		width: 100%;
		height: auto;
		transform-origin: bottom center;
		animation: wife-sway 3.8s ease-in-out 1s infinite;
	}

	@keyframes wife-rise {
		from {
			opacity: 0;
			transform: translateY(70%);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@keyframes wife-sway {
		0%,
		100% {
			transform: rotate(-2deg);
		}
		50% {
			transform: rotate(2deg);
		}
	}

	@media (max-height: 700px) {
		.wife-character {
			width: calc(var(--wife-width) * 0.85);
		}
	}

	@media (max-height: 560px) {
		.wife-character {
			display: none;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.wife-character,
		.wife-character__img {
			animation: none;
		}
	}
</style>
