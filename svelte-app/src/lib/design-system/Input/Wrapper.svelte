<script>
   import { twMerge } from 'tailwind-merge';

   export let className = '';
</script>

<div class={twMerge('relative w-fit', className)}>
   <slot />
</div>
