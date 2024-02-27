<script lang="ts">
   import { getContext } from 'svelte';
   import type { Writable } from 'svelte/store';
   import type { InputContextProps } from './InputGroup.svelte';
   import { twMerge } from 'tailwind-merge';

   export let className = '';
   export let isRequired = false;

   const context = getContext<Writable<InputContextProps>>('@design-system:inputContext');
</script>

<label class={twMerge('text-gray-700 dark:text-gray-200 font-medium', className)} for={$context.inputId} {...$$restProps}>
   <slot />

   {#if isRequired}
      <span class="text-red-500" title="Field required">*</span>
   {/if}
</label>
