<script lang="ts">
	import type { Snippet } from 'svelte';

	type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
	type Size = 'sm' | 'md' | 'lg';
	type ButtonType = 'button' | 'submit';

	interface Props {
		variant?: Variant;
		size?: Size;
		href?: string;
		disabled?: boolean;
		type?: ButtonType;
		fullWidth?: boolean;
		class?: string;
		ariaLabel?: string;
		onclick?: (event: MouseEvent) => void;
		children: Snippet;
	}

	let {
		variant = 'primary',
		size = 'md',
		href,
		disabled = false,
		type = 'button',
		fullWidth = false,
		class: className = '',
		ariaLabel,
		onclick,
		children
	}: Props = $props();

	const baseClasses =
		'inline-flex items-center justify-center gap-2 rounded-full border font-heading font-bold leading-none transition duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-[0.98]';

	const variantClasses: Record<Variant, string> = {
		primary:
			'border-rose bg-rose text-white shadow-button hover:bg-rose-dark focus-visible:outline-rose-dark',
		secondary:
			'border-peach bg-cream-soft text-rose-dark shadow-soft hover:bg-cream focus-visible:outline-rose',
		ghost:
			'border-transparent bg-transparent text-brown hover:bg-white/50 focus-visible:outline-brown',
		danger:
			'border-rose-dark bg-rose-dark text-white shadow-soft hover:brightness-95 focus-visible:outline-rose-dark'
	};

	const sizeClasses: Record<Size, string> = {
		sm: 'min-h-10 px-4 text-sm',
		md: 'min-h-[52px] px-6 text-base',
		lg: 'min-h-14 px-8 text-lg'
	};

	let classes = $derived(
		[
			baseClasses,
			variantClasses[variant],
			sizeClasses[size],
			fullWidth ? 'w-full' : '',
			disabled ? 'cursor-not-allowed opacity-50 shadow-none active:scale-100' : '',
			className
		]
			.filter(Boolean)
			.join(' ')
	);

	function handleLinkClick(event: MouseEvent) {
		if (disabled) {
			event.preventDefault();
			return;
		}

		onclick?.(event);
	}
</script>

{#if href}
	<a
		class={classes}
		href={disabled ? undefined : href}
		aria-label={ariaLabel}
		aria-disabled={disabled}
		tabindex={disabled ? -1 : undefined}
		onclick={handleLinkClick}
	>
		{@render children()}
	</a>
{:else}
	<button class={classes} {type} {disabled} aria-label={ariaLabel} {onclick}>
		{@render children()}
	</button>
{/if}
