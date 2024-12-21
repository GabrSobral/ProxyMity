<script>
   import clsx from 'clsx';
   import { twMerge } from 'tailwind-merge';

   export let className = '';
</script>

<span class={twMerge(clsx('text-red-500 text-xs', className))}>
   <slot />
</span>
