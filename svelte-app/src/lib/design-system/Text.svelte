<script lang="ts">
   import clsx from 'clsx';
   import { twMerge } from 'tailwind-merge';

   let tag: 'span' | 'p' = 'span';
   let size: 'sm' | 'md' | 'lg';
   let defaultTextColor = 'text-gray-200';
   let className = '';

   export { tag, size, defaultTextColor, className as class };
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
