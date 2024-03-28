<script lang="ts">
   import { X } from 'lucide-svelte';
   import { getContext } from 'svelte';
   import { scale } from 'svelte/transition';
   import { twMerge } from 'tailwind-merge';

   import type { IDialogContext } from './root.svelte';
   import { clickOutside } from './click-outside';

   let className: HTMLDivElement['className'] | undefined = undefined;
   let disableCloseButton: boolean | undefined = false;

   export { className as class, disableCloseButton };

   const dialogContext = getContext<IDialogContext>('dialog-context');
</script>

<div
   role="dialog"
   transition:scale={{ duration: 300, start: 0.8, opacity: 0 }}
   class={twMerge(
      'relative rounded-[8px] border border-[#303030] bg-gradient-to-br from-[#136DCE]/50 via-[22%] via-black/20 backdrop-blur p-6 shadow-lg flex flex-col gap-4',
      className
   )}
   use:clickOutside
   on:click_outside={dialogContext.closeDialog}
>
   {#if !disableCloseButton}
      <button
         type="button"
         title="Close dialog"
         class="absolute right-4 top-4"
         on:click={dialogContext.closeDialog}
         aria-label="Close dialog"
      >
         <X size={24} class="text-white" />
      </button>
   {/if}

   <slot />
</div>
