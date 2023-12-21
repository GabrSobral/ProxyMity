<script lang="ts">
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import type { InputContextProps } from './InputGroup.svelte';
	import { twMerge } from 'tailwind-merge';

	export let className = '';

	const context = getContext<Writable<InputContextProps>>('@design-system:inputContext');
</script>

<label
	class={twMerge('text-gray-700 dark:text-gray-200 font-medium', className)}
	for={$context.inputId}
	{...$$restProps}
>
	<slot />
</label>
