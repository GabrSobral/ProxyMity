<script lang="ts">
	import { cn } from '$lib/utils';

	let tag: undefined | 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' = 'h2';
	let size: 'sm' | 'md' | 'lg';
	let defaultTextColor = 'text-white';
	let className = '';

	export { tag, size, defaultTextColor, className as class };
</script>

<svelte:element
	this={tag}
	class={cn(
		'font-semibold text-primary transition-colors',
		{
			'text-md': size === 'sm',
			'text-lg': size === 'md',
			'text-xl': size === 'lg'
		},
		defaultTextColor,
		className
	)}
>
	<slot />
</svelte:element>
