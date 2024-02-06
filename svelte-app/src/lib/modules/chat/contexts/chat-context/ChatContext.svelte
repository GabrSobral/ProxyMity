<script lang="ts" context="module">
   export let typebarRef = writable<HTMLInputElement | null>(null);

   let accessToken: string;
   let chatStateMod: ChatState;
   let chatWorkerMod: Worker | null;
   let connectionMod: HubConnection | null;
   let typebarRefMod: HTMLInputElement | null;
   let userMod: Session['user'] | undefined;
   let webSocketEmitterMod: WebSocketEmitter;

   webSocketEmitter.subscribe(value => {
      webSocketEmitterMod = value;
   });

   chatState.subscribe(value => {
      chatStateMod = value;
   });

   connection.subscribe(value => {
      connectionMod = value;
   });

   chatWorker.subscribe(value => {
      chatWorkerMod = value;
   });

   if (browser) {
      page.subscribe(value => {
         accessToken = value.data?.session?.accessToken as string;
         userMod = value.data?.session?.user as Session['user'] | undefined;
      });

      typebarRef.subscribe(value => {
         typebarRefMod = value;
      });
   }

   async function selectedConversationAsync(conversation: ConversationState) {
      if (conversation === chatStateMod.selectedConversation || !userMod) return;

      const { id: conversationId, isGroup: isConversationGroup } = conversation;

      if (conversation.notifications > 0 && connectionMod)
         webSocketEmitterMod.sendReadMessage({ userId: userMod.id, conversationId, isConversationGroup });

      chatDispatch.selectConversation({ conversation, typeMessage: typebarRefMod?.value || '', currentUserId: userMod.id });

      document.title = `ProxyMity - Chat | ${conversation.groupName || conversation.participants[0].name}`;

      if (typebarRefMod) {
         typebarRefMod.value = conversation.typeMessage;
      }

      chatWorkerMod?.postMessage({
         type: WorkerMethods.READ_CONVERSATION_MESSAGES,
         payload: { conversationId, whoRead: userMod.id, myId: userMod.id, isConversationGroup },
      });

      if (!conversation.hasMessagesFetched) {
         try {
            const { messages } = await APIGetConversationMessages({ conversationId }, { accessToken });
            chatDispatch.setConversationMessages({ conversationId, messages, fromServer: true, currentUserId: userMod.id });
         } catch (error) {
            console.error('🔴 \u001b[31m Error fetching conversations, data will be taken from the cache', error);

            const messages = await getConversationsMessagesAsyncDB(conversationId);
            chatDispatch.setConversationMessages({ conversationId, messages, fromServer: false, currentUserId: userMod.id });
         }
      }
   }

   interface ChatContextProps {
      typebarRef: Writable<HTMLInputElement | null>;
      selectedConversationAsync: (conversation: ConversationState) => Promise<void>;
   }

   export const getChatContext = () => getContext<ChatContextProps>('chat-context');
   export const setChatContext = () => setContext<ChatContextProps>('chat-context', { typebarRef, selectedConversationAsync });
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

   import { EMessageStatuses } from '../../../../../enums/EMessageStatuses';
   import type { IServerMessage } from '../../../../../types/message';

   import type { Command } from '../../workers/db-worker/worker';
   import { chatWorker } from '../../workers/db-worker/initializer';
   import { WorkerMethods } from '../../workers/db-worker/method-types';

   import { serverToLocalMessage } from './functions/parse-server-message';
   import type { WebSocketEmitter } from '../websocket-context/WebSocketEmitter';
   import { connection, webSocketEmitter } from '../websocket-context/stores/connection';

   setChatContext();

   $: session = $page.data.session;

   onMount(() => {
      if (session?.user && session?.accessToken) {
         const userId = session?.user.id;

         chatDispatch.setIsFetchingConversations(true);

         APIGetUserConversations({ id: userId }, { accessToken: session.accessToken })
            .then(conversationsData => {
               console.log('🟢 \u001b[32m Fetching conversations data was successfully.');

               const filteredData = conversationsData.map(data => ({
                  ...data,
                  participants: data.participants.filter(item => item.id !== userId),
               }));

               chatDispatch.setConversationInitialState({ conversationsData: filteredData, currentUserId: userId });
               $chatWorker?.postMessage({ type: WorkerMethods.SAVE_CONVERSATIONS, payload: filteredData });
            })
            .catch(error => {
               console.error(
                  '🔴 \u001b[31m Error on trying to fetch conversations, data will be taken from the cache',
                  error.message
               );

               getConversationCacheAsyncDB({ userId })
                  .then(conversationsData =>
                     chatDispatch.setConversationInitialState({ conversationsData, currentUserId: userId })
                  )
                  .catch(console.error);
            })
            .finally(() => chatDispatch.setIsFetchingConversations(false));
      }
   });

   // 🔵 Receive Message Handler
   async function receiveMessageHandler(serverMessage: IServerMessage) {
      const conversation = $chatState.conversations.find(item => item.id === serverMessage.conversationId);
      const conversationId = conversation?.id || '';
      const isConversationGroup = conversation?.isGroup || false;
      const userId = session?.user.id || '';
      const messageId = serverMessage.id;

      const webSocketsPayload = { userId, conversationId, messageId, isConversationGroup };
      const localMessage = await serverToLocalMessage(serverMessage, isConversationGroup, userId);

      const targetConversationIsSelectedConversation =
         $chatState.selectedConversation && $chatState.selectedConversation?.id === serverMessage.conversationId;

      chatDispatch.addMessage({ message: localMessage });
      chatDispatch.bringToTop(conversationId);

      $chatWorker?.postMessage({ type: WorkerMethods.ADD_MESSAGE, payload: { message: localMessage } });

      $webSocketEmitter.sendReceiveMessage(webSocketsPayload);
      chatDispatch.updateConversationMessageStatus({
         messageId,
         conversationId,
         userId,
         status: EMessageStatuses.RECEIVED,
         appliedForAll: false,
      });

      if (targetConversationIsSelectedConversation) {
         $webSocketEmitter.sendReadMessage(webSocketsPayload);
         chatDispatch.updateConversationMessageStatus({
            conversationId,
            status: EMessageStatuses.READ,
            userId,
            appliedForAll: false,
         });
      } else {
         toast.message('New message', {
            id: serverMessage.id,
            description: serverMessage.content,
            action: {
               label: 'Open',
               onClick: () => conversation && selectedConversationAsync(conversation),
            },
         });
      }
   }

   // 🔵 Receive Read Message Handler
   async function receiveReadMessageHandler(...args: [string, string, boolean, boolean]) {
      if (!session?.user) return;

      const [conversationId, userId, isConversationGroup, readByAll] = args;

      chatDispatch.updateConversationMessageStatus({
         conversationId,
         status: EMessageStatuses.READ,
         userId,
         appliedForAll: readByAll,
      });
      $chatWorker?.postMessage({
         type: WorkerMethods.READ_CONVERSATION_MESSAGES,
         payload: { conversationId, myId: session?.user?.id, whoRead: userId, isConversationGroup },
      });
   }

   // 🔵 Receive Message Status Handler
   function receiveMessageStatusHandler(...args: [string, string, string, string, boolean]) {
      const [messageStatus, messageId, conversationId, userId, appliedForAll] = args;

      const messageDetail = { messageStatus, messageId, conversationId, userId, type: 'message_status', appliedForAll };
      const messageStatusEvent = new CustomEvent(messageId, { detail: messageDetail });

      dispatchEvent(messageStatusEvent);
   }

   // 🔵 Receive Pending Messages Handler
   function receivePendingMessagesHandler(userId: string) {
      chatDispatch.markAsReceivedMessagesFromConversations({ userId });
   }

   $: if ($connection) {
      $connection?.on('receivemessage', receiveMessageHandler);
      $connection?.on('receivereadmessage', receiveReadMessageHandler);
      $connection?.on('receivemessagestatus', receiveMessageStatusHandler);
      $connection?.on('receivependingmessages', receivePendingMessagesHandler);

      console.log('🟢 \u001b[32m  Connection events created.');
   }
</script>

<slot />
