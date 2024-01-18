<script lang="ts">
   import { page } from '$app/stores';
   import { writable } from 'svelte/store';
   import { Info, LogOut, Settings, User } from 'lucide-svelte';
   
   import Text from '$lib/design-system/Text.svelte';
   
   import * as AlertDialog from "$lib/components/ui/alert-dialog";
   import * as DropdownMenu from '$lib/components/ui/dropdown-menu';

   $: user = $page.data.session?.user;

   let show = false;
   let closeModal = writable(() => { show = false; })
</script>

<div class="flex items-center gap-3">
   <div class="flex flex-col gap-1">
      <Text size="md">Good Morning, {user?.name}</Text>
      <Text size="sm" className="text-xs text-gray-300">{user?.email}</Text>
   </div>

   <DropdownMenu.Root>
      <DropdownMenu.Trigger class="flex p-3 rounded-md bg-black border border-gray-800" aria-label="Profile">
         <span class="sr-only">User</span>
         <User size={24} class="text-white" />
      </DropdownMenu.Trigger>

      <DropdownMenu.Content>
         <DropdownMenu.Group>
            <DropdownMenu.Item class="flex gap-4 items-center">
               <Info class="text-white" size={18} />
               About ProxyMity
            </DropdownMenu.Item>

            <DropdownMenu.Item class="flex gap-4 items-center">
               <Settings class="text-white" size={18} />
               Settings
            </DropdownMenu.Item>

            <DropdownMenu.Item class="flex gap-4 items-center" on:click={() => {show = true;}}>
               <LogOut class="text-white" size={18} />
               Sign out
            </DropdownMenu.Item>
         </DropdownMenu.Group>
      </DropdownMenu.Content>
   </DropdownMenu.Root>
</div>

<AlertDialog.Root bind:open={show} bind:onOutsideClick={$closeModal}>
   <AlertDialog.Trigger >
     
   </AlertDialog.Trigger>

   <AlertDialog.Content>
     <AlertDialog.Header>
       <AlertDialog.Title>Are you leaving already?..</AlertDialog.Title>
       <AlertDialog.Description>
         If you logout, all your data saved data will be deleted, and you will must to Login again.
       </AlertDialog.Description>
     </AlertDialog.Header>

     <AlertDialog.Footer>
       <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
       <AlertDialog.Action>Sign out</AlertDialog.Action>
     </AlertDialog.Footer>
   </AlertDialog.Content>
 </AlertDialog.Root>
