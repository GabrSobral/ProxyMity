<script lang="ts">
   import { SignOut, X } from 'phosphor-svelte';
   import { fade, scale } from 'svelte/transition';
   import { signOut } from '@auth/sveltekit/client';
   import { createDialog, melt } from '@melt-ui/svelte';

   import LoadingSpinning from '$lib/design-system/LoadingSpinning.svelte';

   let isLoading = false;

   let {
      elements: { close, content, description, overlay, portalled, title, trigger },
      states: { open },
   } = createDialog();
</script>

<button type="button" class="flex gap-4 justify-between">
   Sign out
   <SignOut class="text-white ml-auto pl-5" size={18} />
</button>

<div>
   {#if $open}
      <div class="fixed inset-0 z-50 bg-black/50" transition:fade={{ duration: 150 }} />

      <div
         class="fixed left-[50%] top-[50%] z-50 max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg"
         transition:scale={{ start: 0.9, opacity: 0 }}
      >
         <h2 class="text-lg font-bold leading-6 dark:text-purple-300 transition-colors text-purple-500">
            "Are you leaving already?.."
         </h2>

         <p class="mb-5 mt-2 leading-normal text-gray-700 dark:text-gray-100">
            If you logout, all your data saved data will be deleted, and you will must to Login again.
         </p>

         <button
            title="Close modal"
            aria-label="close"
            class="absolute top-4 right-4 hover:brightness-75 bg-white dark:bg-gray-800 p-1 rounded-full transition-all"
         >
            <X size={24} class="dark:text-gray-200 text-gray-700" />
         </button>

         <div class="flex gap-1 flex-wrap mt-2">
            <button class="button-outlined" disabled={isLoading} aria-disabled={isLoading}> Cancel </button>

            <button
               type="button"
               on:click={() => {
                  isLoading = true;
                  signOut({ callbackUrl: '/auth/sign-in', redirect: true });
               }}
               class="button-filled"
               disabled={isLoading}
               aria-disabled={isLoading}
            >
               {#if isLoading}
                  <LoadingSpinning size={32} lineSize={2} color="white" />
               {:else}
                  Logout
               {/if}
            </button>
         </div>
      </div>
   {/if}
</div>
