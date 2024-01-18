<script>
   import { page } from '$app/stores';
   import { Info, Settings, User } from 'lucide-svelte';

   import Text from '$lib/design-system/Text.svelte';

   import * as DropdownMenu from '$lib/components/ui/dropdown-menu';

   $: user = $page.data.session?.user;
</script>

<div class="flex items-center gap-3">
   <div class="flex flex-col gap-1">
      <Text size="md">Good Morning, {user?.name}</Text>
      <Text size="sm" className="text-xs text-gray-300">{user?.email}</Text>
   </div>

   <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
         <button type="button" class="flex p-3 rounded-md bg-black border border-gray-800" aria-label="Profile">
            <span class="sr-only">User</span>
            <User size={24} class="text-white" />
         </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content>
         <DropdownMenu.Group>
            <DropdownMenu.Label>My Account</DropdownMenu.Label>

            <DropdownMenu.Separator />

            <DropdownMenu.Item>
               About ProxyMity
               <Info class="text-white" size={18} />
            </DropdownMenu.Item>

            <DropdownMenu.Item>
               Settings

               <Settings class="text-white" size={18} />
            </DropdownMenu.Item>

            <DropdownMenu.Item>Team</DropdownMenu.Item>

            <DropdownMenu.Item>Subscription</DropdownMenu.Item>
         </DropdownMenu.Group>
      </DropdownMenu.Content>
   </DropdownMenu.Root>
</div>
