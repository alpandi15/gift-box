<script lang="ts">
	import Tape from './Tape.svelte';

	type TapeColor = 'neutral' | 'peach' | 'purple';

	interface Props {
		src: string;
		alt?: string;
		caption?: string;
		tilt?: number;
		width?: string;
		tape?: TapeColor | 'none';
		class?: string;
	}

	let {
		src,
		alt = '',
		caption,
		tilt = -3,
		width = '9rem',
		tape = 'neutral',
		class: className = ''
	}: Props = $props();
</script>

<figure
	class={['polaroid', className].filter(Boolean).join(' ')}
	style="--polaroid-tilt: {tilt}deg; --polaroid-width: {width};"
>
	{#if tape !== 'none'}
		<Tape color={tape} position="top-center" rotation={2} width="3.5rem" />
	{/if}
	<div class="polaroid__photo">
		<img src={src} {alt} aria-hidden={alt ? undefined : 'true'} />
	</div>
	{#if caption}
		<figcaption class="polaroid__caption font-script">{caption}</figcaption>
	{/if}
</figure>

<style>
	.polaroid {
		display: inline-block;
		width: var(--polaroid-width);
		margin: 0;
		padding: 0.5rem 0.5rem 0.35rem;
		background: #fffdf8;
		border-radius: 0.2rem;
		box-shadow: var(--gift-shadow-card);
		transform: rotate(var(--polaroid-tilt));
	}

	.polaroid__photo {
		overflow: hidden;
		border-radius: 0.1rem;
		background: var(--gift-color-tan);
		aspect-ratio: 1 / 1;
	}

	.polaroid__photo img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.polaroid__caption {
		margin-top: 0.2rem;
		color: var(--gift-color-brown);
		font-size: 1.15rem;
		font-weight: 600;
		line-height: 1.1;
		text-align: center;
	}
</style>
