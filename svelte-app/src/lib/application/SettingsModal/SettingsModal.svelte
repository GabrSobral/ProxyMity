<script lang="ts">
   import * as Dialog from '$lib/components/ui/dialog';

   import Separator from '$lib/components/ui/separator/separator.svelte';
   import SidebarNav from '$lib/application/SettingsModal/SidebarNav.svelte';
   import { writable } from 'svelte/store';
   import AppearanceForm from './appearance/AppearanceForm.svelte';

   const sidebarNavItems: ['Profile', 'Appearance'] = ['Profile', 'Appearance'];

   let selectedPanel: 'Profile' | 'Appearance' = 'Profile';

   export let isOpened: boolean = false;
   export let closeModal: () => void;

   function selectPanel(panel: 'Profile' | 'Appearance') {
      selectedPanel = panel;
   }

   const onChangeFn = writable((change: boolean) => {
      if (!change) {
         closeModal();
      }
   });
</script>

<Dialog.Root bind:open={isOpened} bind:onOpenChange={$onChangeFn}>
   <Dialog.Trigger />

   <Dialog.Content class="min-w-[90%] h-[90%]">
      <div class="space-y-6 px-5 pb-16 md:block">
         <div class="space-y-0.5">
            <h2 class="text-2xl font-bold tracking-tight">Settings</h2>
            <p class="text-muted-foreground">Manage your account settings and set e-mail preferences.</p>
         </div>

         <Separator class="my-6" />

         <div class="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
            <aside class="-mx-4 lg:w-1/5">
               <SidebarNav items={sidebarNavItems} {selectedPanel} {selectPanel} />
            </aside>

            <div class="flex-1 lg:max-w-2xl">
               {#if selectedPanel === 'Appearance'}
                  <AppearanceForm />
               {/if}

               {#if selectedPanel === 'Profile'}
                  <div />
               {/if}
            </div>
         </div>
      </div>
   </Dialog.Content>
</Dialog.Root>
