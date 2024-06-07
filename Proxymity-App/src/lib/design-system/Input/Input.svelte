<script lang="ts">
   import clsx from 'clsx';
   import { getContext } from 'svelte';
   import { twMerge } from 'tailwind-merge';
   import type { Writable } from 'svelte/store';

   import type { InputEvents } from '.';
   import type { InputContextProps } from './InputGroup.svelte';

   type $$Events = InputEvents;

   export let value = '';
   export let className = '';

   const context = getContext<Writable<InputContextProps>>('@design-system:inputContext');

   const inputId = $context.inputId;
   const hasError = $context.hasError;
</script>

<input
   id={inputId}
   class={twMerge(
      clsx(
         'outline-none flex hover:ring-1 transition-all ring-gray-700 rounded-md bg-gray-900 text-gray-200 focus:outline-purple-500 focus:ring-0 placeholder:text-gray-200 placeholder:font-light w-full px-4 py-3',
         { 'border-red-500 ': hasError }
      ),
      className
   )}
   bind:value
   on:blur
   on:change
   on:click
   on:focus
   on:focusin
   on:focusout
   on:keydown
   on:keypress
   on:keyup
   on:mouseover
   on:mouseenter
   on:mouseleave
   on:paste
   on:input
   {...$$restProps}
/>
