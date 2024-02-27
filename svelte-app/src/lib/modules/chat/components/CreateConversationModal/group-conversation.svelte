<script lang="ts">
   import clsx from 'clsx';
   import { AtSign, Search } from 'lucide-svelte';

   import Text from '$lib/design-system/Text.svelte';
   import Heading from '$lib/design-system/Heading.svelte';
   import InputGroup from '$lib/design-system/Input/InputGroup.svelte';

   import Avatar from '$lib/components/ui/avatar/avatar.svelte';
   import Button from '$lib/components/ui/button/button.svelte';

   let email = '';
   let groupName = '';
   let groupDescription = '';

   interface SearchUser {
      id: string;
      name: string;
      email: string;
      avatarUrl: string | null;
   }

   let users: SearchUser[] = [
      {
         id: crypto.randomUUID(),
         name: 'Gabriel Sobral',
         email: 'gabriel.sobral@gmail.com',
         avatarUrl: 'https://github.com/GabrSobral.png',
      },
      {
         id: crypto.randomUUID(),
         name: 'Sobral Gabriel',
         email: 'asgoth55@gmail.com',
         avatarUrl: null,
      },
   ];

   let selectedUsers: SearchUser[] = [];
</script>

<div class="flex gap-4">
   <form action="" class="flex flex-col gap-4 min-w-[25rem]">
      <InputGroup let:Label let:Input>
         <Label isRequired>Name</Label>

         <Input placeholder="Group Name" type="text" bind:value={groupName} />
      </InputGroup>

      <InputGroup let:Label let:Input>
         <Label>Description</Label>

         <Input placeholder="Group Description" type="text" value={groupDescription} />
      </InputGroup>

      <InputGroup let:Label let:ErrorMessage let:Input let:Wrapper>
         <Label>Search user</Label>

         <Wrapper className="w-full">
            <AtSign size={18} class="absolute left-4 top-2/4 -translate-y-2/4 pointer-events-none" />

            <Input placeholder="account@email.com" type="email" name="account-email" className="pr-20 pl-12" bind:value={email} />

            <Button class="absolute right-2 top-2/4 -translate-y-2/4 w-12">
               <Search size="16" />
            </Button>
         </Wrapper>
      </InputGroup>

      <ul class="flex flex-col gap-2">
         {#each users as user (user.id)}
            {@const name = `${user.name.split(' ')[0]?.charAt(0)}${
               user.name.split(' ')[1]?.charAt(0) || user.name.split(' ')[0]?.charAt(1)
            }`}

            {@const isSelected = selectedUsers.some(item => item.id === user.id)}

            <li
               on:click={() => {
                  if (isSelected) {
                     selectedUsers = selectedUsers.filter(item => item.id !== user.id);
                  } else {
                     selectedUsers = [user, ...selectedUsers];
                  }
               }}
               title="Click to select account"
               class={clsx('flex gap-4 border border-gray-700 p-2 rounded-md hover:bg-gray-600 transition-all cursor-pointer', {
                  'bg-purple-500': isSelected,
               })}
            >
               <Avatar class="bg-purple-500 flex items-center justify-center">
                  {name}
               </Avatar>

               <div class="flex flex-col gap-1">
                  <Text size="md">{user.name}</Text>
                  <Text size="sm">{user.email}</Text>
               </div>
            </li>
         {/each}
      </ul>

      {#if selectedUsers.length && groupName}
         <Button type="submit" class="ml-auto" title={`Create "${groupName}" group.`}>
            Create "{groupName.slice(0, 15)}{groupName.length > 15 ? '...' : ''}" group
         </Button>
      {/if}
   </form>

   <div class="flex flex-col gap-2 min-w-[30rem] bg-gray-950 p-2 flex-1 rounded-lg">
      <Heading size="lg">Members</Heading>

      {#if selectedUsers.length > 0}
         <ul class="flex flex-col gap-2">
            {#each selectedUsers as user (user.id)}
               {@const name = `${user.name.split(' ')[0]?.charAt(0)}${
                  user.name.split(' ')[1]?.charAt(0) || user.name.split(' ')[0]?.charAt(1)
               }`}

               <li
                  on:click={() => {
                     selectedUsers = selectedUsers.filter(item => item.id !== user.id);
                  }}
                  title="Click to select account"
                  class="flex gap-4 border border-gray-700 p-2 rounded-md hover:bg-gray-600 transition-all cursor-pointer"
               >
                  <Avatar class="bg-purple-500 flex items-center justify-center">
                     {name}
                  </Avatar>

                  <div class="flex flex-col gap-1">
                     <Text size="md">{user.name}</Text>
                     <Text size="sm">{user.email}</Text>
                  </div>
               </li>
            {/each}
         </ul>
      {:else}
         <div class="flex flex-1 items-center justify-center">
            <Text size="lg" defaultTextColor="text-gray-400">No members selected.</Text>
         </div>
      {/if}
   </div>
</div>
