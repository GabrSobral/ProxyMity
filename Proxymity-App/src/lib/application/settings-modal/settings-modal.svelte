<script lang="ts">
   import * as Dialog from '$lib/design-system/dialog';

   import SidebarNav from '$lib/application/settings-modal/sidebar-nav.svelte';
   import AppearanceForm from './appearance/appearance-form.svelte';

   const sidebarNavItems: ['Profile', 'Appearance'] = ['Profile', 'Appearance'];

   let selectedPanel: 'Profile' | 'Appearance' = 'Profile';

   export let isOpened: boolean = false;
   export let closeModal: () => void;

   function selectPanel(panel: 'Profile' | 'Appearance') {
      selectedPanel = panel;
   }
</script>

<Dialog.Root {isOpened} closeDialog={closeModal}>
   <Dialog.Panel class="min-w-[90%] h-[90%] overflow-auto">
      <div class="space-y-6 px-5 pb-16 md:block">
         <div class="space-y-0.5">
            <Dialog.Title>Settings</Dialog.Title>
            <Dialog.Description>Manage your account settings and set e-mail preferences.</Dialog.Description>
         </div>

         <div class="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
            <aside class="-mx-4 lg:w-1/5">
               <SidebarNav items={sidebarNavItems} {selectedPanel} {selectPanel} />
            </aside>

            <div class="flex-1 lg:max-w-2xl">
               {#if selectedPanel === 'Appearance'}
                  <AppearanceForm />
               {/if}

               {#if selectedPanel === 'Profile'}
                  <div></div>
               {/if}
            </div>
         </div>
      </div>
   </Dialog.Panel>
</Dialog.Root>
