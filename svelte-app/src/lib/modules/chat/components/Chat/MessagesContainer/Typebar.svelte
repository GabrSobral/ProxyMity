<script lang="ts">
   import { ulid } from 'ulidx';
   import { page } from '$app/stores';
   import { Send, X } from 'lucide-svelte';

   import Button from '$lib/design-system/button/button.svelte';
   import InputGroup from '$lib/design-system/Input/InputGroup.svelte';

   import { chatWorker } from '$lib/modules/chat/workers/db-worker/initializer';
   import { WorkerMethods } from '$lib/modules/chat/workers/db-worker/method-types';
   import { typebarRef } from '$lib/modules/chat/contexts/chat-context/stores/typebar-store';
   import { webSocketEmitter } from '$lib/modules/chat/contexts/websocket-context/stores/connection';

   import type { ILocalMessage } from '../../../../../../types/message';
   import { EMessageStatuses } from '../../../../../../enums/EMessageStatuses';
   import { chatDispatch, chatState } from '$lib/modules/chat/contexts/chat-context/stores/chat';

   let user = $derived($page.data.session?.user);
   let conversationId = $derived($chatState.selectedConversation?.id || '');

   let typeValueManaged = $state('');

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

   $effect(() => {
      $typebarRef?.addEventListener('input', (e: any) => {
         const value = e.target.value as string;

         if (value && !typeValueManaged) {
            handleSpreadTypingStatusToConversation(true);
         } else if (!value && typeValueManaged) {
            handleSpreadTypingStatusToConversation(false);
         }

         typeValueManaged = $typebarRef?.value || '';
      });

      $typebarRef?.addEventListener('keypress', async (e: KeyboardEvent) => {
         if (e.code === 'Enter') {
            sendMessage();
         }
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
            onclick={() => chatDispatch.removeReplyMessageFromConversation({ conversationId })}
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
            class="max-h-[20rem] min-h-[3rem] resize-none flex flex-1 py-3 focus:outline-none outline-none hover:ring-1 transition-all ring-gray-700 rounded-md bg-gray-900 text-gray-200 focus:outline-purple-500 focus:ring-0 placeholder:text-gray-400 w-full px-4"
            placeholder="Type your message"
            autoComplete="off"
         />

         <Button
            type="button"
            title="Send message"
            onclick={sendMessage}
            class="p-2 absolute right-2 top-2/4 -translate-y-2/4 min-w-[2.25rem] min-h-[2.25rem] max-w-[2.75rem] max-h-[2.75rem] mt-auto rounded-[10px]"
         >
            <Send class="text-white" size={18} />
         </Button>
      </Wrapper>
   </InputGroup>
</div>
