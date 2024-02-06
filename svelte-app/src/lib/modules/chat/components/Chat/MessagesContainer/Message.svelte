<script lang="ts">
   import clsx from 'clsx';
   import { onMount } from 'svelte';
   import { page } from '$app/stores';
   import { fly } from 'svelte/transition';
   import { Clock, Info, Share } from 'lucide-svelte';
   import * as Avatar from '$lib/components/ui/avatar';

   import Text from '$lib/design-system/Text.svelte';

   import { chatWorker } from '$lib/modules/chat/workers/db-worker/initializer';
   import { WorkerMethods } from '$lib/modules/chat/workers/db-worker/method-types';
   import { getStatusFromMessage } from '$lib/modules/chat/services/getStatusFromMessage';
   import { chatDispatch, chatState } from '$lib/modules/chat/contexts/chat-context/stores/chat';

   import type { ILocalMessage } from '../../../../../../types/message';
   import { EMessageStatuses } from '../../../../../../enums/EMessageStatuses';
   import { appColor } from '../../../../../../contexts/theme/store';

   export let message: ILocalMessage;
   export let previousMessage: ILocalMessage;

   let messageRef: HTMLLIElement;

   let isMessageConfigVisible = false;
   let isHighlighting = false;
   let showMessageStatus = false;
   const previousIsFromUser = previousMessage?.author?.id === message.author?.id;
   const formatter = Intl.DateTimeFormat('pt-br', { hour: 'numeric', minute: 'numeric' });

   $: accessToken = $page.data.session?.accessToken;
   $: timeToShow = formatter.format(new Date(message.writtenAt));
   $: user = $page.data.session?.user;
   $: isMine = message.author?.id === user?.id;
   $: status = (() => {
      if (message.read.byAllAt !== null) return EMessageStatuses.READ;
      if (message.received.byAllAt !== null) return EMessageStatuses.RECEIVED;
      if (message.sentAt !== null) return EMessageStatuses.SENT;

      return EMessageStatuses.WROTE;
   })();

   type EventHandler = CustomEventInit<
      | {
           messageStatus: EMessageStatuses.SENT | EMessageStatuses.RECEIVED;
           messageId: string;
           conversationId: string;
           userId: string;
           type: 'message_status';
           appliedForAll: boolean;
        }
      | {
           type: 'highlight';
           messageId: string;
        }
   >;

   function messageEventHandler(event: EventHandler) {
      if (!event.detail) return;

      if (event.detail.type === 'message_status') {
         const { messageId, messageStatus, conversationId, userId, appliedForAll } = event.detail;

         if (messageStatus && messageId && conversationId) {
            status = messageStatus;

            chatDispatch.updateConversationMessageStatus({
               conversationId,
               messageId,
               status: messageStatus,
               userId,
               appliedForAll,
            });
            $chatWorker?.postMessage({
               type: WorkerMethods.CHANGE_MESSAGE_STATUS,
               payload: { messageId: messageId, status: messageStatus },
            });
         }
      }

      if (event.detail.type === 'highlight') {
         isHighlighting = true;

         setTimeout(() => {
            isHighlighting = false;
         }, 2000);
      }
   }

   async function handleWithUpdateOfMessageStatus() {
      showMessageStatus = true;

      if ($chatState.selectedConversation?.isGroup) {
         const response = await getStatusFromMessage(
            { messageId: message.id, conversationId: message.conversationId },
            { accessToken: accessToken || '' }
         );

         chatDispatch.updateUsersFromMessageStatus({
            message,
            users: response.map(item => ({ readAt: item.readAt, receivedAt: item.receivedAt, userId: item.userId })),
         });
      } else {
         chatDispatch.updateUsersFromMessageStatus({ message, users: [] });
      }

      setTimeout(() => {
         showMessageStatus = false;
      }, 5000);
   }

   function scrollToRepliedMessage() {
      if (message.repliedMessage) {
         document.getElementById(message.repliedMessage.id)?.scrollIntoView({ block: 'center' });

         const messageEvent = new CustomEvent(message.repliedMessage.id, {
            detail: { type: 'highlight', messageId: message.id },
         });

         dispatchEvent(messageEvent);
      }
   }

   onMount(() => {
      addEventListener(message.id, messageEventHandler);
      return () => removeEventListener(message.id, messageEventHandler);
   });
</script>

<li
   id={message.id}
   data-highlight={isHighlighting}
   class="flex flex-col gap-1 rounded-[1rem] w-full data-[highlight=true]:animate-pulse data-[highlight=true]:bg-gray-800 data-[highlight=true]:p-3 transition-all"
   bind:this={messageRef}
   on:focus={() => {
      isMessageConfigVisible = true;
   }}
   on:blur={() => {
      isMessageConfigVisible = false;
   }}
   on:mouseover={() => {
      isMessageConfigVisible = true;
   }}
   on:mouseleave={() => {
      isMessageConfigVisible = false;
   }}
>
   <div
      class={clsx(
         'flex items-center gap-3 sticky z-20 dark:bg-gray-900 bg-white transition-colors p-1 px-2 rounded-full w-fit -top-3',
         { 'ml-auto': isMine }
      )}
   >
      {#if !isMine && !previousIsFromUser}
         <Avatar.Root>
            <Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
            <Avatar.Fallback>CN</Avatar.Fallback>
         </Avatar.Root>

         <span class="dark:text-gray-200 text-gray-700 transition-colors text-xs">{message.author.name}</span>
      {/if}

      <span class="dark:text-gray-300 text-gray-700 transition-colors text-xs flex items-center gap-2">
         {#if isMine && status === EMessageStatuses.WROTE}
            <Clock size={13} class="dark:text-gray-100 text-gray-600 transition-colors" />
         {:else if isMine}
            <div
               title={status.toString()}
               class={clsx('w-6 h-3 rounded-full flex items-center p-[2px] transition-all', {
                  'justify-end bg-transparent': status === EMessageStatuses.SENT,
                  'justify-end dark:bg-gray-600 bg-gray-300': status === EMessageStatuses.RECEIVED,
                  'justify-start bg-purple-500': status === EMessageStatuses.READ,
               })}
            >
               <div class="rounded-full w-2 h-2 bg-white transition-all" />
            </div>
         {/if}

         {timeToShow}
      </span>
   </div>

   <div class={clsx('flex items-center gap-2 relative', { 'flex-row-reverse': isMine })}>
      <div
         class={clsx('w-fit rounded-[6px] text-white font-light text-sm shadow z-[13] p-1 min-w-[100px]', {
            'bg-gray-950 rounded-tl-none': !isMine,
            'bg-purple-500 rounded-tr-none': isMine && $appColor === 'purple',
            'bg-blue-500 rounded-tr-none': isMine && $appColor === 'blue',
            'bg-red-500 rounded-tr-none': isMine && $appColor === 'red',
            'bg-green-600 rounded-tr-none': isMine && $appColor === 'green',
            'bg-gray-600 dark:bg-gray-800 rounded-tr-none': isMine && $appColor === 'gray',
         })}
      >
         {#if message.repliedMessage}
            <button
               type="button"
               title="Show replied message on chat"
               on:click={scrollToRepliedMessage}
               class={clsx('dark:bg-black bg-white cursor-pointer transition-colors p-2 rounded-[8px] w-full flex flex-col', {
                  'ml-auto': isMine,
               })}
            >
               <span class="text-purple-300 text-xs">{message.author.name}</span>
               <span class="text-gray-200 text-sm">{message.repliedMessage.content}</span>
            </button>
         {/if}

         <p class="p-1">{message.content}</p>
      </div>

      {#if isMessageConfigVisible}
         <button
            type="button"
            transition:fly={{ duration: 300, x: isMine ? 30 : -30, opacity: 0 }}
            class="p-2 bg-gray-700 shadow-lg z-10 rounded-full active:scale-95 transition-all hover:brightness-90"
            on:click={() => {
               chatDispatch.setReplyMessageFromConversation({ conversationId: message.conversationId, message });
            }}
         >
            <Share size={12} color="white" />
         </button>

         <button
            type="button"
            transition:fly={{ duration: 300, x: isMine ? 30 : -30, opacity: 0 }}
            on:click={handleWithUpdateOfMessageStatus}
            class="p-2 bg-gray-700 shadow-lg z-10 rounded-full active:scale-95 transition-all hover:brightness-90"
         >
            <Info size={12} color="white" />
         </button>
      {/if}

      {#if showMessageStatus}
         <div
            class={clsx('flex flex-col gap-3 p-2 bg-gray-800 rounded-md absolute', {
               'left-0': isMine,
               'right-0': !isMine,
            })}
         >
            <Text size="md">
               Sent: {message.sentAt && formatter.format(new Date(message.sentAt))}
            </Text>

            {#each message.read.users as status ((status.userId, status.at))}
               <Text size="md">
                  Read: {status.userId.substring(0, 5)}
                  {status.at ? formatter.format(new Date(status.at)) : 'Nothing'}
               </Text>
            {/each}

            {#each message.received.users as status (status.userId)}
               <Text size="md">
                  Received: {status.userId.substring(0, 5)}
                  {status.at ? formatter.format(new Date(status.at)) : 'Nothing'}
               </Text>
            {/each}
         </div>
      {/if}
   </div>
</li>
