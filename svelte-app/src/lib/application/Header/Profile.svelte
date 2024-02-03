<script lang="ts">
   import { page } from '$app/stores';
   import { writable } from 'svelte/store';
   import { signOut } from '@auth/sveltekit/client';
   import { Info, LogOut, Settings, User } from 'lucide-svelte';

   import Text from '$lib/design-system/Text.svelte';
   import LoadingSpinning from '$lib/design-system/LoadingSpinning.svelte';

   import * as AlertDialog from '$lib/components/ui/alert-dialog';
   import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
   import SettingsModal from '../SettingsModal/SettingsModal.svelte';

   $: user = $page.data.session?.user;

   let show = false;
   let isLoading = false;
   let closeModal = writable(() => {
      show = false;
   });

   let isSettingsModalOpened = false;
   let closeSettingsModal = () => {
      isSettingsModalOpened = false;
   };
</script>

<div class="flex items-center gap-3">
   <div class="flex flex-col gap-1">
      <Text size="md">Good Morning, {user?.name}</Text>
      <Text size="sm" className="text-xs text-gray-300">{user?.email}</Text>
   </div>

   <SettingsModal isOpened={isSettingsModalOpened} closeModal={closeSettingsModal} />

   <DropdownMenu.Root>
      <DropdownMenu.Trigger
         class="flex p-3 rounded-md dark:bg-black bg-gray-100 border dark:border-gray-900 border-gray-200"
         aria-label="Profile"
      >
         <span class="sr-only">User</span>
         <User size={24} />
      </DropdownMenu.Trigger>

      <DropdownMenu.Content>
         <DropdownMenu.Group>
            <DropdownMenu.Item class="flex gap-4 items-center">
               <Info size={18} />
               About ProxyMity
            </DropdownMenu.Item>

            <DropdownMenu.Item
               class="flex gap-4 items-center"
               on:click={() => {
                  isSettingsModalOpened = true;
               }}
            >
               <Settings size={18} />
               Settings
            </DropdownMenu.Item>

            <DropdownMenu.Item
               class="flex gap-4 items-center"
               on:click={() => {
                  show = true;
               }}
            >
               <LogOut size={18} />
               Sign out
            </DropdownMenu.Item>
         </DropdownMenu.Group>
      </DropdownMenu.Content>
   </DropdownMenu.Root>
</div>

<AlertDialog.Root bind:open={show} bind:onOutsideClick={$closeModal}>
   <AlertDialog.Trigger></AlertDialog.Trigger>

   <AlertDialog.Content>
      <AlertDialog.Header>
         <AlertDialog.Title>Are you leaving already?..</AlertDialog.Title>
         <AlertDialog.Description>
            If you logout, all your data saved data will be deleted, and you will must to Login again.
         </AlertDialog.Description>
      </AlertDialog.Header>

      <AlertDialog.Footer>
         <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
         <AlertDialog.Action
            on:click={() => {
               isLoading = true;
               signOut({ callbackUrl: '/auth/sign-in', redirect: true });
            }}
         >
            {#if isLoading}
               <LoadingSpinning size={32} lineSize={2} color="white" />
            {:else}
               Sign out
            {/if}
         </AlertDialog.Action>
      </AlertDialog.Footer>
   </AlertDialog.Content>
</AlertDialog.Root>
