<script lang="ts">
   import { page } from '$app/stores';
   import { Info, LogOut, Settings, User } from 'lucide-svelte';

   import Text from '$lib/design-system/Text.svelte';
   import * as DropdownMenu from '$lib/design-system/dropdown-menu/';

   import SettingsModal from '../SettingsModal/SettingsModal.svelte';

   import LogoutDialog from './logout-dialog.svelte';

   $: user = $page.data.session?.user;

   let showLogoutDialog = false;
   let closeModal = () => {
      showLogoutDialog = false;
   };

   let isSettingsModalOpened = false;
   let closeSettingsModal = () => {
      isSettingsModalOpened = false;
   };
</script>

<div class="flex items-center">
   <div class="flex flex-col gap-1 mr-3">
      <Text size="md">Good Morning, {user?.name}</Text>
      <Text size="sm" class="text-xs text-gray-300">{user?.email}</Text>
   </div>

   <SettingsModal isOpened={isSettingsModalOpened} closeModal={closeSettingsModal} />

   <DropdownMenu.Root>
      <DropdownMenu.Trigger class="flex p-3 rounded-md bg-black border border-gray-900" aria-label="Profile">
         <span class="sr-only">User</span>
         <User size={24} class="text-white" />
      </DropdownMenu.Trigger>

      <DropdownMenu.Panel>
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
               showLogoutDialog = true;
            }}
         >
            <LogOut size={18} />
            Sign out
         </DropdownMenu.Item>
      </DropdownMenu.Panel>
   </DropdownMenu.Root>

   <LogoutDialog isOpened={showLogoutDialog} closeDialog={closeModal} />
</div>
