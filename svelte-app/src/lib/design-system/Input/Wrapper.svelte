<script>
   import { twMerge } from 'tailwind-merge';

   export let className = '';
</script>

<div class={twMerge('relative w-fit text-white', className)}>
   <slot />
</div>
