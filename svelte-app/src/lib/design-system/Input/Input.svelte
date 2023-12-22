<script lang="ts">
	import clsx from 'clsx';
	import { getContext } from 'svelte';
	import { twMerge } from 'tailwind-merge';
	import type { Writable } from 'svelte/store';

	import type { InputContextProps } from './InputGroup.svelte';

	export let value = '';
	export let className = '';

	const context = getContext<Writable<InputContextProps>>('@design-system:inputContext');

	const inputId = $context.inputId;
	const hasError = $context.hasError;
</script>

<input
	id={inputId}
	bind:value
	class={twMerge(
		clsx(
			'outline-none flex hover:ring-1 transition-all dark:ring-gray-700 ring-gray-100 rounded-md dark:bg-gray-900 bg-white dark:text-gray-200 text-gray-700 focus:outline-purple-500 focus:ring-0 dark:placeholder:text-gray-400 placeholder:text-gray-600 w-full px-4 py-3',
			{ 'border-red-500 dark:border-red-500': hasError }
		),
		className
	)}
	{...$$restProps}
/>
