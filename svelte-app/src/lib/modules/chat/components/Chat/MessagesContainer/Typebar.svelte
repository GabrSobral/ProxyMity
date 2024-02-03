<script lang="ts">
   import { ulid } from 'ulidx';
   import { onMount } from 'svelte';
   import { page } from '$app/stores';
   import { Send, X } from 'lucide-svelte';

   import InputGroup from '$lib/design-system/Input/InputGroup.svelte';

   import { chatWorker } from '$lib/modules/chat/workers/db-worker/initializer';
   import { WorkerMethods } from '$lib/modules/chat/workers/db-worker/method-types';
   import { getChatContext } from '$lib/modules/chat/contexts/chat-context/ChatContext.svelte';
   import { chatDispatch, chatState } from '$lib/modules/chat/contexts/chat-context/stores/chat';
   import { webSocketEmitter } from '$lib/modules/chat/contexts/websocket-context/stores/connection';

   import type { ILocalMessage } from '../../../../../../types/message';
   import { EMessageStatuses } from '../../../../../../enums/EMessageStatuses';
   import { Button } from '$lib/components/ui/button';
   import { appColor } from '../../../../../../contexts/theme/store';

   $: user = $page.data.session?.user;
   $: conversationId = $chatState.selectedConversation?.id || '';

   let typeValueManaged = '';
   let { typebarRef } = getChatContext();

   async function sendMessage() {
      if (!user || !$chatState.selectedConversation || !$typebarRef?.value.trim()) return;

      const message: ILocalMessage = {
         id: ulid(),
         content: $typebarRef?.value.trim(),
         writtenAt: new Date(),
         sentAt: null,
         received: { byAllAt: null, users: [] },
         read: { byAllAt: null, users: [] },
         conversationId,
         author: { id: user.id, name: user.name },
         repliedMessage: $chatState.selectedConversation.replyMessage
            ? {
                 id: $chatState.selectedConversation.replyMessage.id,
                 content: $chatState.selectedConversation.replyMessage?.content,
              }
            : null,
      };

      $chatWorker?.postMessage({ type: WorkerMethods.ADD_MESSAGE, payload: { message } });

      chatDispatch.addMessage({ message });
      chatDispatch.bringToTop(message.conversationId);

      $webSocketEmitter.sendMessage({ message, isConversationGroup: $chatState.selectedConversation.isGroup });

      $chatWorker?.postMessage({
         type: WorkerMethods.CHANGE_MESSAGE_STATUS,
         payload: { messageId: message.id, status: EMessageStatuses.SENT },
      });

      chatDispatch.saveTypeMessageFromConversation({ conversationId, typeMessage: '' });

      $typebarRef.value = '';
      typeValueManaged = '';

      chatDispatch.removeReplyMessageFromConversation({ conversationId: $chatState.selectedConversation.id });
   }

   function handleSpreadTypingStatusToConversation(typing: boolean) {
      $webSocketEmitter.sendTyping({ conversationId, typing, authorId: user?.id || '' });
   }

   onMount(() => {
      $typebarRef?.addEventListener('input', (e: any) => {
         const value = e.target.value as string;

         if (value && !typeValueManaged) {
            handleSpreadTypingStatusToConversation(true);
         } else if (!value && typeValueManaged) {
            handleSpreadTypingStatusToConversation(false);
         }

         typeValueManaged = $typebarRef?.value || '';
      });
   });
</script>

<div class="flex flex-col gap-2 m-1 mt-auto">
   {#if $chatState.selectedConversation?.replyMessage}
      <div class="w-full p-2 flex gap-2 bg-black rounded-lg">
         <div class="bg-gray-950 w-full p-2 rounded-md flex flex-col gap-1">
            <span class="text-purple-300 text-xs">
               {typeof $chatState.selectedConversation?.replyMessage === 'object' &&
                  $chatState.selectedConversation?.replyMessage.author.name}
            </span>

            <span class="text-white text-sm">
               {typeof $chatState.selectedConversation?.replyMessage === 'object' &&
                  $chatState.selectedConversation?.replyMessage.content}
            </span>
         </div>

         <button
            type="button"
            title="Cancel reply message"
            on:click={() => chatDispatch.removeReplyMessageFromConversation({ conversationId })}
            class="ml-auto bg-gray-900 hover:brightness-125 flex items-center justify-center rounded-full max-w-[2.5rem] min-w-[2.5rem] max-h-[2.5rem] min-h-[2.5rem]"
         >
            <X size={24} color="white" />
         </button>
      </div>
   {/if}

   <InputGroup let:Label let:Wrapper className="flex w-full">
      <Label className="sr-only">Type a message</Label>

      <Wrapper className="w-full h-fit">
         <input
            id="typebar-input-id"
            bind:this={$typebarRef}
            type="text"
            class="max-h-[20rem] min-h-[3.5rem] resize-none flex flex-1 py-3 focus:outline-none outline-none hover:ring-1 transition-all dark:ring-gray-700 ring-gray-100 rounded-md dark:bg-gray-900 bg-white dark:text-gray-200 text-gray-700 focus:outline-purple-500 focus:ring-0 dark:placeholder:text-gray-400 placeholder:text-gray-600 w-full px-4"
            placeholder="Type your message"
            autoComplete="off"
         />

         <Button
            type="button"
            title="Send message"
            variant={$appColor}
            on:click={sendMessage}
            class="p-2 absolute right-3 top-2/4 -translate-y-2/4 min-w-[2.75rem] min-h-[2.75rem] max-w-[2.75rem] max-h-[2.75rem] mt-auto rounded-[10px]"
         >
            <Send class="text-white" size={24} />
         </Button>
      </Wrapper>
   </InputGroup>
</div>
