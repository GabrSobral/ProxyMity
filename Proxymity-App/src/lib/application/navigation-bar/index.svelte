<script lang="ts">
   import clsx from 'clsx';
   import { twMerge } from 'tailwind-merge';
   import { ChevronLeft, LogOutIcon } from 'lucide-svelte';

   import Profile from './profile.svelte';
   import SidebarItem from './sidebar-item.svelte';
   import LogoutDialog from './logout-dialog.svelte';

   import Text from '$lib/design-system/text.svelte';

   let isOpened = $state(false);

   let showLogoutDialog = $state(false);

   function closeModal() {
      showLogoutDialog = false;
   }

   function handleOpen() {
      isOpened = !isOpened;
   }
</script>

<aside
   class={twMerge(
      clsx('h-full w-[17rem] flex flex-col border-r-gray-800 border-r transition-all relative', { 'w-[5rem]': isOpened })
   )}
>
   <header class="flex relative border-b-gray-900 border-b">
      <div class="px-4 py-3">
         <img src={isOpened ? '/Logo.svg' : '/horizontal-logo.svg'} alt="ProxyMity Logo" width={isOpened ? 50 : 136} />
      </div>

      <button
         type="button"
         class={twMerge(
            clsx('h-[2rem] rounded-l-lg -translate-y-2/4 top-2/4 w-6 bg-purple-500 absolute right-0 z-10 transition-all', {
               '-right-[1.5rem] rounded-l-none rounded-r-lg': isOpened,
            })
         )}
         onclick={handleOpen}
         title="Toggle Sidebar"
      >
         <ChevronLeft class="text-white" size={24} />
      </button>
   </header>

   <div class={twMerge(clsx('p-2 flex flex-col justify-center', { 'justify-center': !isOpened }))}>
      <Text size="sm" class={twMerge(clsx('mx-2', { 'mx-auto': isOpened }))}>MAIN</Text>

      <nav class="mt-2 flex flex-col gap-2">
         <SidebarItem
            isCollapsed={isOpened}
            title={{ label: 'Team', icon: 'business' }}
            items={[
               { label: 'Chats', path: '/chat', icon: 'message' },
               // { label: 'Settings', icon: 'settings', onclick: () => alert('Modal') },
            ]}
         />
      </nav>
   </div>

   <button
      type="button"
      data-is-collapsed={isOpened}
      onclick={() => (showLogoutDialog = true)}
      class="mb-1 font-semibold truncate overflow-hidden whitespace-nowrap data-[is-collapsed=true]:justify-center text-white mx-3 flex gap-4 mt-auto p-3 rounded-lg bg-gray-950 hover:brightness-150 transition-all"
   >
      <LogOutIcon class="text-white" size={24} />
      {#if !isOpened}
         Sign Out
      {/if}
   </button>

   <Profile isCollapsed={isOpened} />
</aside>

<LogoutDialog isOpened={showLogoutDialog} closeDialog={closeModal} />
