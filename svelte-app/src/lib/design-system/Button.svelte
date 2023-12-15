<script lang="ts">
	import clsx from 'clsx';
	import { twMerge } from 'tailwind-merge';

  export let element: "button" | "a" = "button"
  
	export let className = '';
	export let isOutlined = false;
</script>

<svelte:element
  this={element}
  class={twMerge(
    clsx(
      'disabled:cursor-not-allowed disabled:opacity-40 min-h-[44px] border-2 border-solid h-fit w-fit whitespace-nowrap px-4 py-[0.375rem] rounded-[6px] flex gap-2 items-center justify-center font-semibold hover:brightness-90 transition-all outline-none focus:outline-purple-500 focus:ring-0',
      {
        'border-purple-500 text-white bg-gradient-to-r from-[#B809A6] border-0 to-[#1C64CE]': !isOutlined,
        'dark:border-gray-200 border-gray-700 dark:text-gray-200 text-gray-700 bg-transparent': isOutlined,
      }
    ),
    className
  )}
  {...$$restProps}
>
  <slot />
</svelte:element>
