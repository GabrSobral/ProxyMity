<script lang="ts" context="module">
   export interface IDialogContext {
      isOpened: boolean;
      closeDialog: () => void;
   }
</script>

<script lang="ts">
   import { fade } from 'svelte/transition';
   import { onMount, setContext } from 'svelte';
   import { appendToPortal } from '../../../utils/portal';

   let content: HTMLElement;

   onMount(() => {
      appendToPortal(content);

      const handleKeyDown = (event: KeyboardEvent) => {
         if (event.key === 'Escape') {
            closeDialog();
         }
      };

      window.addEventListener('keydown', handleKeyDown);

      return () => {
         window.removeEventListener('keydown', handleKeyDown);
      };
   });

   export let isOpened: boolean;
   export let closeDialog: () => void;

   setContext<IDialogContext>('dialog-context', {
      isOpened,
      closeDialog,
   });
</script>

<div role="none" bind:this={content}>
   {#if isOpened}
      <div
         role="none"
         transition:fade={{ duration: 300 }}
         class="fixed z-30 inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center w-screen h-screen"
      >
         <slot />
      </div>
   {/if}
</div>
