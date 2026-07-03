<script lang="ts">
	type TapeColor = 'neutral' | 'peach' | 'purple';
	type TapePosition = 'top-center' | 'top-left' | 'top-right';

	interface Props {
		color?: TapeColor;
		position?: TapePosition;
		rotation?: number;
		width?: string;
		class?: string;
	}

	let {
		color = 'neutral',
		position = 'top-center',
		rotation = -4,
		width = '5rem',
		class: className = ''
	}: Props = $props();

	const colorVar = $derived(
		{
			neutral: 'var(--gift-tape-neutral)',
			peach: 'var(--gift-tape-peach)',
			purple: 'var(--gift-tape-purple)'
		}[color]
	);
</script>

<span
	class={['tape', `tape--${position}`, className].filter(Boolean).join(' ')}
	style="--tape-color: {colorVar}; --tape-rotate: {rotation}deg; --tape-width: {width};"
	aria-hidden="true"
></span>

<style>
	.tape {
		position: absolute;
		z-index: 20;
		width: var(--tape-width);
		height: 1.35rem;
		background: var(--tape-color);
		background-image: repeating-linear-gradient(
			90deg,
			rgb(255 255 255 / 22%) 0,
			rgb(255 255 255 / 22%) 1px,
			transparent 1px,
			transparent 7px
		);
		box-shadow: 0 2px 6px rgb(107 63 42 / 14%);
		transform: rotate(var(--tape-rotate));
		pointer-events: none;
		/* subtle torn ends */
		clip-path: polygon(
			3% 0,
			97% 4%,
			100% 96%,
			2% 100%,
			0 50%
		);
	}

	.tape::after {
		position: absolute;
		inset: 0;
		background: linear-gradient(180deg, rgb(255 255 255 / 30%), transparent 55%);
		content: '';
	}

	.tape--top-center {
		top: -0.7rem;
		left: 50%;
		transform: translateX(-50%) rotate(var(--tape-rotate));
	}

	.tape--top-left {
		top: -0.65rem;
		left: 1.25rem;
	}

	.tape--top-right {
		top: -0.65rem;
		right: 1.25rem;
	}
</style>
