<script lang="ts">
   import { Search } from 'lucide-svelte';

   import ChatList from './ChatList/index.svelte';
   import InputGroup from '$lib/design-system/Input/InputGroup.svelte';
</script>

<aside class="h-full min-w-[340px] rounded-[1rem] flex flex-col gap-4">
   <InputGroup let:Label let:Input let:Wrapper>
      <Label className="sr-only">Search</Label>

      <Wrapper className="w-full">
         <Input type="search" placeholder="Search..." className="pl-12 dark:bg-gray-950" />

         <Search
            class="dark:text-white text-gray-700 transition-colors opacity-60 absolute left-4 top-2/4 -translate-y-2/4 pointer-events-none"
            size={24}
         />
      </Wrapper>
   </InputGroup>

   <ChatList />
</aside>
