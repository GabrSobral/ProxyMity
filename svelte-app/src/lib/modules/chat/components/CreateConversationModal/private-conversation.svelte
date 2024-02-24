<script lang="ts">
   import { AtSign, Search } from 'lucide-svelte';

   import Text from '$lib/design-system/Text.svelte';
   import Avatar from '$lib/components/ui/avatar/avatar.svelte';
   import Button from '$lib/components/ui/button/button.svelte';
   import InputGroup from '$lib/design-system/Input/InputGroup.svelte';
   import { getUserByEmailAsync } from '../../services/getUserByEmailAsync';
   import { page } from '$app/stores';
   import type { User } from '../../../../../types/user';

   let email = '';

   let selectedAccount: User | null = null;
   let searchedUser: User | null = null;

   let accessToken = $page.data.session.accessToken;

   async function searchUser() {
      const user = await getUserByEmailAsync({ userEmail: email }, { accessToken });

      searchedUser = { ...user, status: 'online' };
   }
</script>

<form action="" class="flex flex-col gap-4">
   <InputGroup let:Label let:ErrorMessage let:Input let:Wrapper>
      <Label>Search user</Label>

      <Wrapper className="w-full">
         <AtSign class="absolute left-4 top-2/4 -translate-y-2/4 pointer-events-none" />

         <Input placeholder="account@email.com" type="email" name="account-email" className="pr-20 pl-12" bind:value={email} />
         <Button class="absolute right-2 top-2/4 -translate-y-2/4 w-12" on:click={searchUser}>
            <Search size="16" />
         </Button>
      </Wrapper>
   </InputGroup>

   {#if searchedUser}
      {@const name = `${searchedUser.name.split(' ')[0]?.charAt(0)}${
         searchedUser.name.split(' ')[1]?.charAt(0) || searchedUser.name.split(' ')[0]?.charAt(1)
      }`}

      {@const isSelected = selectedAccount?.id === searchedUser?.id}

      <button
         on:click={() => {
            selectedAccount = searchedUser;
         }}
         title="Click to select account"
         class="flex gap-4 border border-gray-700 p-2 rounded-md hover:bg-gray-600 transition-all cursor-pointer"
      >
         <Avatar class="bg-purple-500 flex items-center justify-center">{name}</Avatar>

         <div class="flex flex-col gap-1">
            <Text size="md">{searchedUser.name}</Text>
            <Text size="sm">{searchedUser.email}</Text>
         </div>
      </button>
   {/if}

   <Button type="submit" class="ml-auto">Create conversation with Gabriel</Button>
</form>
