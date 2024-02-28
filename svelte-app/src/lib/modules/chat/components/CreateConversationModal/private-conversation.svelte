<script lang="ts">
   import clsx from 'clsx';
   import { page } from '$app/stores';
   import { AtSign, Plus, Search } from 'lucide-svelte';

   import Text from '$lib/design-system/Text.svelte';
   import InputGroup from '$lib/design-system/Input/InputGroup.svelte';
   import LoadingSpinning from '$lib/design-system/LoadingSpinning.svelte';

   import Avatar from '$lib/components/ui/avatar/avatar.svelte';
   import Button from '$lib/components/ui/button/button.svelte';

   import type { User } from '../../../../../types/user';
   import { getUserByEmailAsync } from '../../services/getUserByEmailAsync';
   import { showMessageSonner } from '../../../../../contexts/error-context/store';
   import { createPrivateConversationAsync } from '../../services/createPrivateConversationAsync';
   import { chatDispatch } from '../../contexts/chat-context/stores/chat';

   export let closeModal: () => void;

   let email = '';

   let selectedAccount: User | null = null;
   let searchedUser: { user: User | null; isLoading: boolean } = { user: null, isLoading: false };

   let accessToken = $page.data.session?.accessToken;
   let currentUser = $page.data.session?.user;

   let isCreatingLoading = false;

   let errorMessage = '';

   async function searchUser() {
      errorMessage = '';
      searchedUser.user = null;

      searchedUser.isLoading = true;

      try {
         const user = await getUserByEmailAsync({ userEmail: email }, { accessToken: accessToken || '' });

         if (!user) {
            errorMessage = 'No user was found with this e-mail.';
         }

         searchedUser.user = { ...user, status: 'online' };
      } catch (error: any) {
         console.error('An error occurred at:', new Date(), error);
         showMessageSonner({ message: error?.response?.data?.error || error?.message });
      } finally {
         searchedUser.isLoading = false;
      }
   }

   async function createChat() {
      if (!selectedAccount) {
         console.error('No user was selected.');
         return showMessageSonner({ message: 'No user was selected. Please, select one' });
      }

      if (!accessToken) {
         console.error('No access token detected');
         return showMessageSonner({ message: 'No access token detected. Try logout and login again.' });
      }

      try {
         isCreatingLoading = true;

         const newConversation = await createPrivateConversationAsync({ participantId: selectedAccount.id }, { accessToken });
         const newConversationState = {
            id: newConversation.id,
            isGroup: false,
            createdAt: new Date(),
            hasMessagesFetched: true,
            messages: [],
            notifications: 0,
            participants: [
               {
                  id: selectedAccount.id,
                  createdAt: selectedAccount.createdAt,
                  email: selectedAccount.email,
                  name: selectedAccount.name,
                  photoUrl: selectedAccount.photoUrl,
                  removedAt: null,
                  lastOnline: new Date(),
               },
            ],
            replyMessage: null,
            typeMessage: '',
            groupDescription: null,
            groupName: null,
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

<form class="flex flex-col gap-4" on:submit|preventDefault={searchUser}>
   <InputGroup let:Label let:ErrorMessage let:Input let:Wrapper>
      <Label>Search user</Label>

      <Wrapper className="w-full">
         <AtSign class="absolute left-4 top-2/4 -translate-y-2/4 pointer-events-none" />

         <Input placeholder="account@email.com" type="email" name="account-email" className="pr-20 pl-12" bind:value={email} />

         <Button type="submit" class="absolute right-2 top-2/4 -translate-y-2/4 w-12">
            {#if searchedUser.isLoading}
               <LoadingSpinning size={18} lineSize={3} />
            {:else}
               <Search size="16" />
            {/if}
         </Button>
      </Wrapper>

      {#if errorMessage}
         <ErrorMessage>{errorMessage}</ErrorMessage>
      {/if}
   </InputGroup>

   {#if searchedUser.user}
      {@const name = `${searchedUser.user?.name.split(' ')[0]?.charAt(0)}${
         searchedUser.user?.name.split(' ')[1]?.charAt(0) || searchedUser.user?.name?.split(' ')[0]?.charAt(1)
      }`}

      {@const isSelected = selectedAccount?.id === searchedUser.user?.id}

      <button
         on:click={() => {
            if (selectedAccount) {
               selectedAccount = null;
            } else {
               selectedAccount = searchedUser.user;
            }
         }}
         title="Click to select account"
         class={clsx('flex gap-4 border border-gray-700 p-2 rounded-md hover:brightness-110 transition-all cursor-pointer', {
            'bg-purple-500': isSelected,
         })}
      >
         <Avatar class="bg-purple-500 flex items-center justify-center">{name}</Avatar>

         <div class="flex flex-col gap-1 items-start">
            <Text size="md">
               {searchedUser.user?.name}

               {#if currentUser?.id === searchedUser.user?.id}
                  (You)
               {/if}
            </Text>

            <Text size="sm">{searchedUser.user?.email}</Text>
         </div>
      </button>
   {/if}

   {#if selectedAccount}
      <Button type="button" on:click={createChat} class="ml-auto" disabled={currentUser?.id === searchedUser.user?.id}>
         {#if currentUser?.id === selectedAccount?.id}
            You cannot create a chat with yourself.
         {:else if isCreatingLoading}
            <LoadingSpinning size={18} lineSize={3} />
         {:else}
            <Plus />
            Create conversation with {selectedAccount?.name.split(' ')[0]}
         {/if}
      </Button>
   {/if}
</form>
