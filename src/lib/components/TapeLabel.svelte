<script lang="ts">
	type LabelColor = 'neutral' | 'peach' | 'purple';

	interface Props {
		text: string;
		color?: LabelColor;
		icon?: string;
		tilt?: number;
		class?: string;
	}

	let { text, color = 'neutral', icon, tilt = -2, class: className = '' }: Props = $props();

	const bg = $derived(
		{
			neutral: 'var(--gift-tape-neutral)',
			peach: 'var(--gift-tape-peach)',
			purple: 'var(--gift-tape-purple)'
		}[color]
	);
</script>

<span
	class={['tape-label', className].filter(Boolean).join(' ')}
	style="--label-bg: {bg}; --label-tilt: {tilt}deg;"
>
	{#if icon}
		<img class="tape-label__icon" src={icon} alt="" aria-hidden="true" />
	{/if}
	<span class="tape-label__text">{text}</span>
</span>

<style>
	.tape-label {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		padding: 0.15rem 0.9rem;
		background: var(--label-bg);
		background-image: repeating-linear-gradient(
			90deg,
			rgb(255 255 255 / 20%) 0,
			rgb(255 255 255 / 20%) 1px,
			transparent 1px,
			transparent 7px
		);
		box-shadow: 0 2px 6px rgb(107 63 42 / 14%);
		color: var(--gift-color-brown);
		font-family: var(--font-family-script);
		font-size: 1.35rem;
		font-weight: 700;
		line-height: 1.1;
		letter-spacing: 0.01em;
		transform: rotate(var(--label-tilt));
		/* torn tape ends */
		clip-path: polygon(2% 0, 98% 5%, 100% 95%, 1% 100%, 0 48%);
	}

	.tape-label__icon {
		width: 1rem;
		height: 1rem;
	}

	@media (prefers-reduced-motion: reduce) {
		.tape-label {
			transform: rotate(var(--label-tilt));
		}
	}
</style>
