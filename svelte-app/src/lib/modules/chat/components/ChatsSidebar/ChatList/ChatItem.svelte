<script lang="ts">
   import clsx from 'clsx';
   import { page } from '$app/stores';
   import { twMerge } from 'tailwind-merge';
   import { Clock, User } from 'lucide-svelte';

   import { chatState } from '$lib/modules/chat/contexts/chat-context/stores/chat';
   import { connection } from '$lib/modules/chat/contexts/websocket-context/stores/connection';
   import { getChatContext } from '$lib/modules/chat/contexts/chat-context/ChatContext.svelte';
   import type { ConversationState } from '$lib/modules/chat/contexts/chat-context/stores/chat-store-types';
   import { EMessageStatuses } from '../../../../../../enums/EMessageStatuses';

   export let conversation: ConversationState;

   $: user = $page.data.session?.user;
   $: lastMessage = conversation.messages?.at(-1);
   $: isSelectedContact = $chatState.selectedConversation?.id === conversation.id;
   $: isMine = lastMessage?.author?.id === user?.id;
   $: draft = conversation.typeMessage;
   $: status = (() => {
      if (!lastMessage) {
         return;
      }

      if (lastMessage.read.byAllAt !== null) return EMessageStatuses.READ;
      if (lastMessage.received.byAllAt !== null) return EMessageStatuses.RECEIVED;
      if (lastMessage.sentAt !== null) return EMessageStatuses.SENT;

      return EMessageStatuses.WROTE;
   })();

   $connection?.on('receiveTyping', (typingWs, authorId, conversationId) => {
      if (conversationId === conversation.id) {
         typing = typingWs;

         const author = conversation.participants.find(item => item.id === authorId);
      }
   });

   let { selectedConversationAsync } = getChatContext();
   let typing = false;

   const formatLastMessageDate = Intl.DateTimeFormat('pt-br', { hour: 'numeric', minute: 'numeric' });
   const conversationName = conversation?.groupName || conversation?.participants.find(item => item.id !== user?.id)?.name || '';
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
   role="button"
   tabindex="0"
   class="w-full hover:dark:border-gray-700 hover:border-gray-100 border-[1px] dark:border-gray-900 border-white relative py-2 px-3 rounded-md flex gap-4 cursor-pointer hover:opacity-90 group dark:bg-gray-900 bg-white transition-all shadow-md"
   on:click={() => selectedConversationAsync(conversation)}
>
   <div
      class={`${
         isSelectedContact ? 'w-full left-0 opacity-100' : 'w-0 left-2/4 opacity-10'
      } absolute h-full gradient transition-all rounded-md top-0 z-0 duration-[0.3s] mx-auto`}
   />

   <div class="relative min-w-[40px] min-h-[40px] max-w-[40px] max-h-[40px]">
      <div
         class="min-w-[40px] min-h-[40px] max-w-[40px] max-h-[40px] rounded-full z-0 shadow-xl flex items-center justify-center dark:bg-white bg-black transition-colors"
      >
         <User size={20} class="dark:text-black text-white transition-colors" />
      </div>
   </div>

   <div class={'flex flex-col overflow-hidden w-full z-10'}>
      <span
         class={`${
            isSelectedContact ? 'text-white' : 'text-gray-700 dark:text-gray-200'
         } truncate font-medium flex items-center justify-between gap-3 `}
      >
         {conversationName}
         {#if conversation.id === user?.id}
            (You)
         {/if}

         {#if lastMessage}
            <span
               class="text-[12px] dark:text-gray-200 transition-colors text-gray-700 ml-auto data-[is-selected=true]:text-gray-100"
               data-is-selected={isSelectedContact}
            >
               {formatLastMessageDate.format(new Date(lastMessage.writtenAt))}
            </span>
         {/if}
      </span>

      <div
         class={twMerge(
            clsx('truncate flex justify-between gap-4 dark:text-gray-200 text-gray-600 text-sm', {
               'text-purple-500': typing && !isSelectedContact,
               'text-white': isSelectedContact,
            })
         )}
      >
         {#if typing}
            <span class="text-purple-500 dark:text-purple-300 font-semibold">Typing...</span>
         {:else if lastMessage && !draft}
            <span class="flex gap-4 w-full">
               {lastMessage.content}

               <span class="flex items-center gap-2 ml-auto">
                  {#if isMine && status === EMessageStatuses.WROTE}
                     <Clock size={13} class="dark:text-gray-100 text-gray-600 transition-colors" />
                  {:else if isMine}
                     <div
                        title={status?.toString()}
                        class={clsx('w-6 h-3 rounded-full flex items-center p-[2px] transition-all', {
                           'justify-end bg-transparent': status === EMessageStatuses.SENT,
                           'justify-end dark:bg-gray-600 bg-gray-300': status === EMessageStatuses.RECEIVED,
                           'justify-start bg-purple-500': status === EMessageStatuses.READ,
                        })}
                     >
                        <div class="rounded-full w-2 h-2 bg-white transition-all" />
                     </div>
                  {/if}
               </span>
            </span>
         {:else if draft && !isSelectedContact}
            <span class="text-gray-300 truncate" title={draft}>Draft: {draft}</span>
         {:else}
            <span>Start the conversation...</span>
         {/if}

         {#if conversation.notifications > 0}
            <span
               class="rounded-full bg-purple-500 w-5 h-5 ml-auto flex items-center justify-center text-[12px] text-white font-medium animate-pulse z-10"
            >
               {conversation.notifications}
            </span>
         {/if}
      </div>
   </div>
</div>
