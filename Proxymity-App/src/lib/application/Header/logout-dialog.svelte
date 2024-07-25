<script lang="ts">
   import { signOut } from '@auth/sveltekit/client';

   import * as Dialog from '$lib/design-system/dialog';
   import Button from '$lib/design-system/button/button.svelte';
   import LoadingSpinning from '$lib/design-system/loading-spinning.svelte';

   type Props = {
      closeDialog: () => void;
      isOpened: boolean;
   };

   const { closeDialog, isOpened }: Props = $props();

   let isLoading = $state(false);

   async function handleSignOut() {
      isLoading = true;
      signOut({ callbackUrl: '/auth/login/sign-in', redirect: true });
   }
</script>

<Dialog.Root {closeDialog} {isOpened}>
   <Dialog.Panel>
      <Dialog.Title>Are you leaving already?..</Dialog.Title>

      <Dialog.Description>
         If you logout, all your data saved data will be deleted, and you will must to Login again.
      </Dialog.Description>

      <div class="flex gap-4 ml-auto">
         <Button type="button" isOutlined onclick={closeDialog} disabled={isLoading}>Cancel</Button>

         <Button type="button" onclick={handleSignOut} disabled={isLoading}>
            {#if isLoading}
               <LoadingSpinning size={24} lineSize={2} color="white" />
            {:else}
               Sign out
            {/if}</Button
         >
      </div>
   </Dialog.Panel>
</Dialog.Root>
