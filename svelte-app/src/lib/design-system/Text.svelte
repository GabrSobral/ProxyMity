<script lang="ts">
   import clsx from 'clsx';
   import { twMerge } from 'tailwind-merge';

   export let tag: 'span' | 'p' = 'span';
   export let size: 'sm' | 'md' | 'lg';
   export let defaultTextColor = 'text-gray-700 dark:text-white';
   export let className = '';
</script>

<svelte:element
   this={tag}
   class={twMerge(
      clsx(
         'transition-colors ',
         {
            'text-xs': size === 'sm',
            'text-sm': size === 'md',
            'text-md': size === 'lg',
         },
         defaultTextColor
      ),
      className
   )}
>
   <slot />
</svelte:element>
