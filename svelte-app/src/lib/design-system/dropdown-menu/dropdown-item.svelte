<script lang="ts">
   import { cn } from '$lib/utils';
   import type { ButtonEvents } from '../button';

   let className: string | undefined;

   type $$Events = ButtonEvents;

   export { className as class };
</script>

<button
   on:click
   tabindex="0"
   class={cn('text-white hover:bg-purple-500 rounded-md transition-colors px-2 py-[6px] select-none', className)}
   {...$$restProps}
>
   <slot />
</button>
