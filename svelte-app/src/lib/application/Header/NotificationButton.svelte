<script lang="ts">
   import * as DropdownMenu from '$lib/components/ui/dropdown-menu';

   import { Bell } from 'lucide-svelte';
</script>

<DropdownMenu.Root>
   <DropdownMenu.Trigger asChild>
      <button type="button" class="flex p-3 rounded-md bg-black border border-gray-800" aria-label="Profile">
         <span class="sr-only">Notifications</span>
         <Bell size={24} class="text-white" />
      </button>
   </DropdownMenu.Trigger>

   <DropdownMenu.Content>
      <DropdownMenu.Group>
         <DropdownMenu.Label>Notifications 17</DropdownMenu.Label>

         <DropdownMenu.Separator />

         <DropdownMenu.Item>Notification 1</DropdownMenu.Item>
      </DropdownMenu.Group>
   </DropdownMenu.Content>
</DropdownMenu.Root>
