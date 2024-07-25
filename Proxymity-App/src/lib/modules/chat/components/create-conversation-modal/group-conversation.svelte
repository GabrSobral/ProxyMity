<script lang="ts">
   import clsx from 'clsx';
   import { page } from '$app/stores';
   import { AtSign, Search } from 'lucide-svelte';

   import Text from '$lib/design-system/text.svelte';
   import * as Avatar from '$lib/design-system/avatar/';
   import Heading from '$lib/design-system/heading.svelte';
   import Button from '$lib/design-system/button/button.svelte';
   import InputGroup from '$lib/design-system/Input/InputGroup.svelte';

   import { getUserByEmailAsync } from '../../services/getUserByEmailAsync';
   import { createGroupConversationAsync } from '../../services/createGroupConversationAsync';

   import type { User } from '../../../../../types/user';
   import { chatDispatch } from '../../contexts/chat-context/stores/chat';
   import { showMessageSonner } from '../../../../../contexts/error-context/store';
   import type { ConversationState } from '../../contexts/chat-context/stores/chat-store-types';

   export let closeModal: () => void;

   let email = '';
   let groupName = '';
   let groupDescription = '';

   let isCreatingLoading = false;

   let accessToken = $page.data.session?.accessToken;
   let currentUser = $page.data.session?.user;

   let errorMessage = '';

   let usersData: { users: User[]; isLoading: boolean } = { users: [], isLoading: false };
   let selectedUsers: User[] = [];

   async function searchUser() {
      errorMessage = '';
      usersData.users = [];

      usersData.isLoading = true;

      try {
         const user = await getUserByEmailAsync({ userEmail: email }, { accessToken: accessToken || '' });

         if (!user) {
            errorMessage = 'No user was found with this e-mail.';
         }

         usersData.users = [...usersData.users, { ...user, status: 'online' }];
      } catch (error: any) {
         console.error('An error occurred at:', new Date(), error);
         showMessageSonner({ message: error?.response?.data?.error || error?.message });
      } finally {
         usersData.isLoading = false;
      }
   }

   async function createChat() {
      if (!currentUser?.id) {
         console.error('No user was found');
         return showMessageSonner({ message: 'No user was not found. Try logout and login again.' });
      }

      if (!selectedUsers.length) {
         console.error('No user was selected.');
         return showMessageSonner({ message: 'No user was selected. Please, select one' });
      }

      if (!accessToken) {
         console.error('No access token detected');
         return showMessageSonner({ message: 'No access token detected. Try logout and login again.' });
      }

      try {
         isCreatingLoading = true;

         const newConversation = await createGroupConversationAsync(
            {
               name: groupName,
               description: groupDescription,
               participants: [currentUser.id, ...selectedUsers.map(user => user.id)],
            },
            { accessToken }
         );
         const newConversationState: ConversationState = {
            id: newConversation.id,
            isGroup: true,
            createdAt: new Date(),
            hasMessagesFetched: true,
            messages: [],
            notifications: 0,
            participants: selectedUsers.map(user => ({
               id: user.id,
               createdAt: user.createdAt,
               email: user.email,
               firstName: user.firstName,
               lastName: user.lastName,
               photoUrl: user.photoUrl,
               removedAt: null,
               lastOnline: new Date(),
            })),
            replyMessage: null,
            typeMessage: '',
            groupDescription,
            groupName,
            conversationPinnedAt: null,
         };

         chatDispatch.addConversation(newConversationState);
         chatDispatch.selectConversation({ conversation: newConversationState, typeMessage: '', currentUserId: '' });

         closeModal();
      } catch (error: any) {
         console.error('An error occurred at:', new Date(), error);
         showMessageSonner({ message: error?.response?.data?.error || error?.message });
      } finally {
         isCreatingLoading = false;
      }
   }
</script>

<div class="flex gap-4 h-full">
   <form
      action=""
      class="flex flex-col gap-4 min-w-[25rem]"
      onsubmit={e => {
         e.preventDefault();
         searchUser();
      }}
   >
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

            <Button class="absolute right-2 top-2/4 -translate-y-2/4 w-12" type="submit" disabled={!email}>
               <Search size="16" />
            </Button>
         </Wrapper>
      </InputGroup>

      <ul class="flex flex-col gap-2">
         {#each usersData.users as user (user.id)}
            {@const isSelected = selectedUsers.some(item => item.id === user.id)}

            <li
               onclick={() => {
                  if (isSelected) {
                     selectedUsers = selectedUsers.filter(item => item.id !== user.id);
                  } else {
                     selectedUsers = [user, ...selectedUsers];
                     usersData.users = [];

                     email = '';
                  }
               }}
               title="Click to select account"
               class={clsx('flex gap-4 border border-gray-700 p-2 rounded-md hover:bg-gray-600 transition-all cursor-pointer', {
                  'bg-purple-500': isSelected,
               })}
            >
               <Avatar.Image src="" username={user.firstName} />

               <div class="flex flex-col gap-1">
                  <Text size="md">{user.firstName}</Text>
                  <Text size="sm">{user.email}</Text>
               </div>
            </li>
         {/each}
      </ul>

      {#if selectedUsers.length && groupName}
         <Button type="button" on:click={createChat} class="ml-auto" title={`Create "${groupName}" group.`}>
            Create "{groupName.slice(0, 15)}{groupName.length > 15 ? '...' : ''}" group
         </Button>
      {/if}
   </form>

   <div class="flex flex-col gap-2 min-w-[30rem] bg-gray-950 p-2 flex-1 rounded-lg">
      <Heading size="lg">Members</Heading>

      {#if selectedUsers.length > 0}
         <ul class="flex flex-col gap-2">
            {#each selectedUsers as user (user.id)}
               <li
                  onclick={() => {
                     selectedUsers = selectedUsers.filter(item => item.id !== user.id);
                  }}
                  title="Click to select account"
                  class="flex gap-4 border border-gray-700 p-2 rounded-md hover:bg-gray-600 transition-all cursor-pointer"
               >
                  <Avatar.Image src="" username={user.firstName} />

                  <div class="flex flex-col gap-1">
                     <Text size="md">{user.firstName}</Text>
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
