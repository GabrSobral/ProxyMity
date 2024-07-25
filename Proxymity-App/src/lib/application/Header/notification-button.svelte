<script lang="ts">
   // import * as Tabs from '$lib/design-system/tabs';
   import * as Avatar from '$lib/design-system/avatar';
   import * as DropdownMenu from '$lib/design-system/dropdown-menu';

   import Text from '$lib/design-system/text.svelte';

   import { Bell, CheckCheck, Settings } from 'lucide-svelte';
   import Button from '$lib/design-system/button/button.svelte';
</script>

<DropdownMenu.Root>
   <DropdownMenu.Trigger class="flex p-3 rounded-md bg-black border border-gray-800" aria-label="Profile">
      <span class="sr-only">Notifications</span>
      <Bell size={24} class="text-white" />
   </DropdownMenu.Trigger>

   <DropdownMenu.Content>
      <DropdownMenu.Group>
         <DropdownMenu.Label class="text-lg flex gap-4 w-full items-center">
            Notifications
            <span
               class="font-semibold text-sm flex items-center justify-center min-w-[22px] min-h-[22px] max-w-[22px] max-h-[22px] dark:bg-white dark:text-black bg-black text-white rounded-full p-1"
               >17</span
            >
         </DropdownMenu.Label>

         <Tabs.Root value="all-notifications">
            <Tabs.List>
               <Tabs.Trigger value="all-notifications">View all</Tabs.Trigger>
               <Tabs.Trigger value="mention-notifications">Mentions</Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content value="all-notifications">
               <DropdownMenu.Item class="flex gap-4 max-w-[30rem] min-w-[25rem] overflow-hidden">
                  <Avatar.Root>
                     <Avatar.Image src="https://github.com/GabrSobral.png" alt="@shadcn" />
                     <Avatar.Fallback>CN</Avatar.Fallback>
                  </Avatar.Root>

                  <div class="flex flex-col gap-2 w-full">
                     <Text size="md" className="font-semibold">
                        <span class="underline">Python</span> sent a new message
                     </Text>

                     <Text size="sm" className="text-gray-600">{new Date().toUTCString()}</Text>
                  </div>
               </DropdownMenu.Item>

               <DropdownMenu.Item class="flex gap-4 max-w-[30rem] min-w-[25rem] overflow-hidden">
                  <Avatar.Root>
                     <Avatar.Image src="https://github.com/GabrSobral.png" alt="@shadcn" />
                     <Avatar.Fallback>CN</Avatar.Fallback>
                  </Avatar.Root>

                  <div class="flex flex-col gap-2 w-full">
                     <Text size="md" className="font-semibold">
                        <span class="underline">Python</span> sent a new message
                     </Text>

                     <Text size="sm" className="text-gray-600">{new Date().toUTCString()}</Text>
                  </div>
               </DropdownMenu.Item>
            </Tabs.Content>

            <Tabs.Content value="mention-notifications">
               <DropdownMenu.Item class="flex gap-4 max-w-[30rem] min-w-[25rem] overflow-hidden">
                  <Avatar.Root>
                     <Avatar.Image src="https://github.com/GabrSobral.png" alt="@shadcn" />
                     <Avatar.Fallback>CN</Avatar.Fallback>
                  </Avatar.Root>

                  <div class="flex flex-col gap-2 w-full">
                     <Text size="md" className="font-semibold">
                        <span class="underline">Python</span> sent a new message
                     </Text>

                     <Text size="sm" className="text-gray-600">{new Date().toUTCString()}</Text>
                  </div>
               </DropdownMenu.Item>
            </Tabs.Content>
         </Tabs.Root>

         <DropdownMenu.Separator />

         <div class="px-3 py-2 flex justify-between items-center gap-4">
            <a href="#" title="Notification settings" aria-label="Notification settings">
               <Settings class="dark:text-white text-black" />
            </a>

            <Button class="py-1 h-8">
               <CheckCheck class="text-black" /> Mark all as read
            </Button>
         </div>
      </DropdownMenu.Group>
   </DropdownMenu.Content>
</DropdownMenu.Root>
