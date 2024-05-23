<script lang="ts">
   import clsx from 'clsx';
   import { page } from '$app/stores';
   import { twMerge } from 'tailwind-merge';
   import { Clock, Pin } from 'lucide-svelte';

   import { cn } from '$lib/utils';

   import * as Avatar from '$lib/design-system/avatar';

   import { chatState } from '$lib/modules/chat/contexts/chat-context/stores/chat';
   import { connection } from '$lib/modules/chat/contexts/websocket-context/stores/connection';
   import { selectConversationAsync } from '$lib/modules/chat/contexts/chat-context/ChatContext.svelte';
   import type { ConversationState } from '$lib/modules/chat/contexts/chat-context/stores/chat-store-types';

   import { EMessageStatuses } from '../../../../../../enums/EMessageStatuses';

   let typing = $state(false);

   type Props = { conversation: ConversationState };
   let { conversation }: Props = $props();

   let user = $derived($page.data.session?.user);
   let lastMessage = $derived(conversation.messages?.at(-1));
   let isSelectedContact = $derived($chatState.selectedConversation?.id === conversation.id);
   let isMine = $derived(lastMessage?.author?.id === user?.id);
   let draft = $derived(conversation.typeMessage);
   let status = $derived.by(() => {
      let lastMessageScoped = conversation.messages?.at(-1);

      if (!lastMessageScoped) {
         return;
      }

      if (lastMessageScoped.read.byAllAt !== null) return EMessageStatuses.READ;
      if (lastMessageScoped.received.byAllAt !== null) return EMessageStatuses.RECEIVED;
      if (lastMessageScoped.sentAt !== null) return EMessageStatuses.SENT;

      return EMessageStatuses.WROTE;
   });

   $connection?.on('receiveTyping', (typingWs, authorId, conversationId) => {
      if (conversationId === conversation.id) {
         typing = typingWs;

         const author = conversation.participants.find(item => item.id === authorId);
      }
   });

   const formatLastMessageDate = Intl.DateTimeFormat('pt-br', { hour: 'numeric', minute: 'numeric' });
   const conversationName = conversation?.groupName || conversation?.participants.find(item => item.id !== user?.id)?.name || '';
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<div
   role="button"
   tabindex="0"
   class="w-full relative py-[0.4rem] px-3 rounded-md flex gap-4 cursor-pointer hover:opacity-90 group bg-[#0A0A0A] transition-all shadow-md border-1 border-gray-950"
   onclick={() => selectConversationAsync(conversation)}
>
   <div
      aria-hidden="true"
      class={`${
         isSelectedContact ? 'w-full left-0 opacity-100' : 'w-0 left-2/4 opacity-10'
      } absolute h-full bg-gradient-to-r from-[#9D12E0dd] via-[75%] via-transparent to-transparent transition-all rounded-md top-0 z-0 duration-[0.3s] mx-auto items-center`}
   ></div>

   <Avatar.Image src="https://github.com/shadcn.png" username={conversationName} />

   <div class={'flex flex-col overflow-hidden w-full z-10'}>
      <span
         class={`${
            isSelectedContact ? 'text-white' : 'text-gray-200'
         } truncate font-medium flex items-center justify-between gap-3 `}
      >
         {conversationName}
         {#if conversation.id === user?.id}
            (You)
         {/if}

         {#if lastMessage}
            <span
               class="text-[12px] text-gray-200 transition-colors ml-auto data-[is-selected=true]:text-gray-100"
               data-is-selected={isSelectedContact}
            >
               {formatLastMessageDate.format(new Date(lastMessage.writtenAt))}
            </span>
         {/if}

         {#if conversation.conversationPinnedAt}
            <Pin size="16" class={twMerge(clsx('text-gray-100 transition-colors', { 'text-white': isSelectedContact }))} />
         {/if}
      </span>

      <div
         class={cn('truncate flex justify-between gap-4 text-gray-200 text-sm max-w-[17rem]', {
            'text-purple-500': typing && !isSelectedContact,
            'text-white': isSelectedContact,
         })}
      >
         {#if typing}
            <span class="text-white dark:text-purple-300 font-semibold">Typing...</span>
         {:else if lastMessage && !draft}
            <span class="flex gap-4 w-full truncate">
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
                        <div class="rounded-full w-2 h-2 bg-white transition-all"></div>
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
               class="rounded-full shadow-purple-500 shadow-[0_0_30px] bg-purple-500 w-5 h-5 ml-auto flex items-center justify-center text-[12px] text-white font-medium animate-pulse z-10"
            >
               {conversation.notifications}
            </span>
         {/if}
      </div>
   </div>
</div>
