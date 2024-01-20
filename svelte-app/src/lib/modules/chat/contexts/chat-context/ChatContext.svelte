<script lang="ts" context="module">
   export let typebarRef = writable<HTMLInputElement | null>(null);

   let chatStateModule: ChatState;
   let connectionModule: HubConnection | null;
   let userModule: Session['user'] | undefined;
   let accessToken: string;
   let typebarRefModule: HTMLInputElement | null;
   let webSocketEmitterModule: WebSocketEmitter;

   webSocketEmitter.subscribe(value => {
      webSocketEmitterModule = value;
   });

   chatState.subscribe(value => {
      chatStateModule = value;
   });

   connection.subscribe(value => {
      connectionModule = value;
   });

   if (browser) {
      page.subscribe(value => {
         userModule = value.data?.session?.user as Session['user'] | undefined;
         accessToken = value.data?.session?.accessToken as string;
      });

      typebarRef.subscribe(value => {
         typebarRefModule = value;
      });
   }

   async function selectedConversationAsync(conversation: ConversationState) {
      if (conversation === chatStateModule.selectedConversation || !userModule) return;

      if (conversation.notifications > 0 && connectionModule)
         webSocketEmitterModule.sendReadMessage({
            userId: userModule.id,
            conversationId: conversation.id,
            isConversationGroup: conversation.isGroup,
         });

      chatDispatch.selectConversation({
         conversation,
         typeMessage: typebarRefModule?.value || '',
         currentUserId: userModule.id,
      });

      readConversationMessagesAsyncDB({
         conversationId: conversation.id,
         whoRead: userModule.id,
         myId: userModule.id,
         isConversationGroup: conversation.isGroup,
      });

      if (!conversation.hasMessagesFetched) {
         try {
            const { messages } = await APIGetConversationMessages({ conversationId: conversation.id }, { accessToken });
            chatDispatch.setConversationMessages({ conversationId: conversation.id, messages: messages, fromServer: true });
         } catch (error) {
            console.error('🔴 \u001b[31m Error fetching conversations, data will be taken from the cache', error);

            const messages = await getConversationsMessagesAsyncDB(conversation.id);
            chatDispatch.setConversationMessages({ conversationId: conversation.id, messages, fromServer: false });
         }
      }
   }

   interface ChatContextProps {
      typebarRef: Writable<HTMLInputElement | null>;
      selectedConversationAsync: (conversation: ConversationState) => Promise<void>;
   }

   export const getChatContext = () => getContext<ChatContextProps>('chat-context');
   export const setChatContext = () =>
      setContext<ChatContextProps>('chat-context', { typebarRef, selectedConversationAsync });
</script>

<script lang="ts">
   import { page } from '$app/stores';
   import { toast } from 'svelte-sonner';
   import { browser } from '$app/environment';
   import { chatDispatch } from './stores/chat';
   import type { Session } from '@auth/sveltekit';
   import { writable, type Writable } from 'svelte/store';
   import type { HubConnection } from '@microsoft/signalr';
   import { setContext, getContext, onMount } from 'svelte';

   import { chatState } from './stores/chat';
   import type { ConversationState, ChatState } from './stores/chat-store-types';

   import { APIGetUserConversations } from '../../../../../services/api/get-user-conversations';
   import { APIGetConversationMessages } from '../../../../../services/api/get-conversation-messages';

   import { getConversationCacheAsyncDB } from '../../../../../services/database/use-cases/get-conversations-state';
   import { getConversationsMessagesAsyncDB } from '../../../../../services/database/use-cases/get-conversations-messages';
   import { readConversationMessagesAsyncDB } from '../../../../../services/database/use-cases/read-conversation-messages';

   import { EMessageStatuses } from '../../../../../enums/EMessageStatuses';
   import type { IServerMessage } from '../../../../../types/message';

   import { serverToLocalMessage } from './functions/parse-server-message';
   import { WorkerMethods } from '../../workers/db-worker/method-types';
   import { chatWorker } from '../../workers/db-worker/initializer';
   import { connection, webSocketEmitter } from '../websocket-context/stores/connection';
   import type { WebSocketEmitter } from '../websocket-context/WebSocketEmitter';

   setChatContext();

   $: session = $page.data.session;

   onMount(() => {
      if (session?.user && session?.accessToken) {
         const user = session?.user;

         chatDispatch.setIsFetchingConversations(true);

         APIGetUserConversations({ id: user.id }, { accessToken: session.accessToken })
            .then(conversationsData => {
               console.log('🟢 \u001b[32m Fetching conversations data was successfully.');

               const filteredData = conversationsData.map(data => ({
                  ...data,
                  participants: data.participants.filter(item => item.id !== user.id),
               }));

               chatDispatch.setConversationInitialState({ conversationsData: filteredData });
               $chatWorker?.postMessage({ type: WorkerMethods.SAVE_CONVERSATIONS, payload: filteredData });
            })
            .catch(error => {
               console.error(
                  '🔴 \u001b[31m Error on trying to fetch conversations, data will be taken from the cache',
                  error.message
               );

               getConversationCacheAsyncDB({ userId: user.id })
                  .then(conversationsData =>
                     chatDispatch.setConversationInitialState({ conversationsData })
                  )
                  .catch(console.error);
            })
            .finally(() => chatDispatch.setIsFetchingConversations(false));
      }
   });

   async function receiveMessageHandler(serverMessage: IServerMessage) {
      if (!serverMessage || !session?.user) return;

      const webSocketsPayload = {
         userId: session?.user.id,
         conversationId: serverMessage.conversationId,
         messageId: serverMessage.id,
         isConversationGroup: $chatState.selectedConversation?.isGroup || false,
      };

      if ($chatState.selectedConversation && $chatState.selectedConversation?.id === serverMessage.conversationId) {
         $webSocketEmitter.sendReceiveMessage(webSocketsPayload);
         $webSocketEmitter.sendReadMessage(webSocketsPayload);
      } else {
         const messageConversation = $chatState.conversations.find(item => item.id === serverMessage.conversationId);

         toast.message('New message', {
            description: serverMessage.content,
            id: serverMessage.id,
            action: {
               label: 'Open',
               onClick: () => {
                  const conversation = $chatState.conversations.find(item => item.id === serverMessage.conversationId);

                  if (conversation) {
                     selectedConversationAsync(conversation);
                  }
               },
            },
         });

         if (messageConversation)
            $webSocketEmitter.sendReceiveMessage({
               ...webSocketsPayload,
               isConversationGroup: messageConversation?.isGroup,
            });
      }

      const localMessage = await serverToLocalMessage(serverMessage);

      chatDispatch.addMessage({ message: localMessage });
      chatDispatch.bringToTop(serverMessage.conversationId);

      $chatWorker?.postMessage({ type: WorkerMethods.ADD_MESSAGE, payload: { message: localMessage } });
   }

   async function receiveReadMessageHandler(userId: string, conversationId: string, isConversationGroup: boolean) {
      if (!session?.user) return;

      chatDispatch.updateConversationMessageStatus({ conversationId, status: EMessageStatuses.READ, userId });
      $chatWorker?.postMessage({
         type: WorkerMethods.READ_CONVERSATION_MESSAGES,
         payload: {
            conversationId,
            myId: session?.user?.id,
            whoRead: userId,
            isConversationGroup,
         },
      });
   }

   function receiveMessageStatusHandler(
      messageStatus: string,
      messageId: string,
      conversationId: string,
      userId: string
   ) {
      const messageStatusEvent = new CustomEvent(messageId, {
         detail: { messageStatus, messageId, conversationId, userId },
      });

      dispatchEvent(messageStatusEvent);
   }

   function receivePendingMessagesHandler(userId: string) {
      chatDispatch.markAsReceivedMessagesFromConversations({ userId });
   }

   $: if ($connection) {      
      $connection?.on('receivemessage', receiveMessageHandler);
      $connection?.on('receivereadmessage', receiveReadMessageHandler);
      $connection?.on('receivemessagestatus', receiveMessageStatusHandler);
      $connection?.on('receivependingmessages', receivePendingMessagesHandler);

      console.log("🟢 \u001b[32m  Connection events created.");
   }
</script>

<slot />
