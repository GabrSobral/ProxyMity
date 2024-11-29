<script lang="ts">
   import Text from '$lib/design-system/text.svelte';
   import * as Avatar from '$lib/design-system/avatar';

   import { page } from '$app/stores';

   let user = $derived($page.data.session?.user);

   type $$Props = {
      isCollapsed: boolean;
   };

   let { isCollapsed }: $$Props = $props();
</script>

<div
   class="w-full bg-gradient-to-t from-[#136DCE]/50 via-[22%] pt-6 via-pink/20 backdrop-blur transition-all p-4 flex gap-4 data-[is-collapsed=true]:justify-center"
   data-is-collapsed={isCollapsed}
>
   <Avatar.Image src="https://github.com/shadcn.png" username={`${user.firstName} ${user?.lastName}`.trim()} />

   {#if !isCollapsed}
      <div class="flex flex-col gap-1 overflow-hidden">
         <Text size="md" class="text-white whitespace-nowrap truncate">{user.firstName} {user?.lastName}</Text>
         <Text size="sm" class="text-gray-200 whitespace-nowrap truncate">{user.email}</Text>
      </div>
   {/if}
</div>
