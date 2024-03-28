<script lang="ts">
   import { signOut } from '@auth/sveltekit/client';

   import * as Dialog from '$lib/design-system/dialog';
   import Button from '$lib/design-system/button/button.svelte';
   import LoadingSpinning from '$lib/design-system/LoadingSpinning.svelte';

   export let closeDialog: () => void;
   export let isOpened: boolean;

   let isLoading = false;

   async function handleSignOut() {
      isLoading = true;
      signOut({ callbackUrl: '/auth/sign-in', redirect: true });
   }
</script>

<Dialog.Root {closeDialog} {isOpened}>
   <Dialog.Panel>
      <Dialog.Title>Are you leaving already?..</Dialog.Title>

      <Dialog.Description>
         If you logout, all your data saved data will be deleted, and you will must to Login again.
      </Dialog.Description>

      <div class="flex gap-4">
         <Button type="button" isOutlined on:click={closeDialog}>Cancel</Button>

         <Button type="button" on:click={handleSignOut}>
            {#if isLoading}
               <LoadingSpinning size={32} lineSize={2} color="white" />
            {:else}
               Sign out
            {/if}</Button
         >
      </div>
   </Dialog.Panel>
</Dialog.Root>
