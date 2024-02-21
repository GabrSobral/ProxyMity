<script lang="ts">
   import { AtSign, Search } from 'lucide-svelte';

   import Text from '$lib/design-system/Text.svelte';
   import Avatar from '$lib/components/ui/avatar/avatar.svelte';
   import Button from '$lib/components/ui/button/button.svelte';
   import InputGroup from '$lib/design-system/Input/InputGroup.svelte';

   let email = '';

   let selectedAccount = null;
</script>

<form action="" class="flex flex-col gap-4">
   <InputGroup let:Label let:ErrorMessage let:Input let:Wrapper>
      <Label>Search user</Label>

      <Wrapper className="w-full">
         <AtSign class="absolute left-4 top-2/4 -translate-y-2/4 pointer-events-none" />

         <Input placeholder="account@email.com" type="email" name="account-email" className="pr-20 pl-12" value={email} />

         <Button class="absolute right-4 top-2/4 -translate-y-2/4 w-12">
            <Search size="16" />
         </Button>
      </Wrapper>
   </InputGroup>

   <ul class="flex flex-col gap-2">
      <li
         title="Click to select account"
         class="flex gap-4 border border-gray-700 p-2 rounded-md hover:bg-gray-600 transition-all cursor-pointer"
      >
         <Avatar class="bg-purple-500 flex items-center justify-center">GS</Avatar>

         <div class="flex flex-col gap-1">
            <Text size="md">Gabriel Sobral</Text>
            <Text size="sm">Gabriel.Sobral@email.com</Text>
         </div>
      </li>
   </ul>

   <Button type="submit" class="ml-auto">Create conversation with Gabriel</Button>
</form>
