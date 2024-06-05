<script lang="ts" context="module">
   let accessToken: string;
   let chatStateMod: ChatState;
   let chatWorkerMod: Worker | null;
   let connectionMod: HubConnection | null;

   let typebarRefMod: HTMLInputElement | null;
   let messagesContainerRefMod: HTMLUListElement | null;

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

   messagesContainer.subscribe(value => {
      messagesContainerRefMod = value;
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

   export async function selectConversationAsync(conversation: ConversationState) {
      if (conversation === chatStateMod.selectedConversation || !userMod) return;

      const { id: conversationId, isGroup: isConversationGroup } = conversation;

      if (conversation.notifications > 0 && connectionMod)
         webSocketEmitterMod.sendReadMessage({ userId: userMod.id, conversationId, isConversationGroup });

      const unreadMessagesCount = conversation.notifications;

      chatDispatch.selectConversation({ conversation, typeMessage: typebarRefMod?.value || '', currentUserId: userMod.id });

      document.title = `ProxyMity - Chat | ${conversation.groupName || conversation.participants[0].name}`;

      if (typebarRefMod) {
         typebarRefMod.value = conversation.typeMessage;
      }

      // Post a message to chat worker to change the pending message status to READ.
      chatWorkerMod?.postMessage({
         type: WorkerMethods.READ_CONVERSATION_MESSAGES,
         payload: { conversationId, whoRead: userMod.id, myId: userMod.id, isConversationGroup },
      });

      if (!conversation.hasMessagesFetched) {
         try {
            // Get messages from API and set to state
            const { messages } = await APIGetConversationMessages({ conversationId }, { accessToken });

            logSuccess(`Messages was successfully loaded from "${conversationId}" conversation`);
            chatDispatch.setConversationMessages({ conversationId, messages, fromServer: true, currentUserId: userMod.id });
         } catch (error) {
            logError('Error fetching conversations, data will be taken from the cache', error);

            // Get messages from cache and set to state
            const messages = await getConversationsMessagesAsyncDB(conversationId);
            chatDispatch.setConversationMessages({ conversationId, messages, fromServer: false, currentUserId: userMod.id });
         }
      }

      notificationsDispatch.updateLastMessagesHistory({ ...conversation, notifications: unreadMessagesCount }, userMod?.id);
   }

   interface ChatContextProps {
      typebarRef: Writable<HTMLInputElement | null>;
      selectConversationAsync: (conversation: ConversationState) => Promise<void>;
   }

   export const getChatContext = () => getContext<ChatContextProps>('chat-context');
   export const setChatContext = () => setContext<ChatContextProps>('chat-context', { typebarRef, selectConversationAsync });
</script>

<script lang="ts">
   import { page } from '$app/stores';
   import { browser } from '$app/environment';
   import type { Session } from '@auth/sveltekit';
   import type { Writable } from 'svelte/store';
   import type { HubConnection } from '@microsoft/signalr';
   import { setContext, getContext, onMount } from 'svelte';

   import { typebarRef, chatState, chatDispatch, messagesContainer } from './stores/chat';
   import type { ConversationState, ChatState } from './stores/chat-store-types';

   import { APIGetUserConversations } from '../../../../../services/api/get-user-conversations';
   import { APIGetConversationMessages } from '../../../../../services/api/get-conversation-messages';

   import { getConversationCacheAsyncDB } from '../../../../../services/database/use-cases/get-conversations-state';
   import { getConversationsMessagesAsyncDB } from '../../../../../services/database/use-cases/get-conversations-messages';

   import { chatWorker } from '../../workers/db-worker/initializer';
   import { WorkerMethods } from '../../workers/db-worker/method-types';

   import { showMessageSonner } from '../../../../../contexts/error-context/store';
   import type { WebSocketEmitter } from '../websocket-context/WebSocketEmitter';
   import { connection, webSocketEmitter } from '../websocket-context/stores/connection';

   import { receiveMessageHandler } from './events/receiveMessageHandler';
   import { receiveReadMessageHandler } from './events/receiveReadMessageHandler';
   import { receiveMessageStatusHandler } from './events/receiveMessageStatusHandler';
   import { receivePendingMessagesHandler } from './events/receivePendingMessagesHandler';

   import { logError, logSuccess } from '../../../../../utils/logging';
   import { notificationsDispatch, notificationsState } from './stores/notification';

   setChatContext();

   type Props = { children: any };
   let { children }: Props = $props();

   let session = $derived($page.data.session);

   onMount(() => {
      if (session?.user && session?.accessToken) {
         const userId = session?.user?.id;

         if (!userId) {
            logError('User Id not found.');
            showMessageSonner({ message: 'User Id not found.' });
            return;
         }

         chatDispatch.setIsFetchingConversations(true);

         APIGetUserConversations({ id: userId }, { accessToken: session.accessToken })
            .then(conversationsData => {
               logSuccess('Fetching conversations data was successfully.');

               const filteredData = conversationsData.map(data => ({
                  ...data,
                  participants: data.participants.filter(item => item.id !== userId),
               }));

               chatDispatch.setConversationInitialState({ conversationsData: filteredData, currentUserId: userId });
               $chatWorker?.postMessage({ type: WorkerMethods.SAVE_CONVERSATIONS, payload: filteredData });
            })
            .catch(error => {
               logError('Error on trying to fetch conversations, data will be taken from the cache', error.message);

               getConversationCacheAsyncDB({ userId })
                  .then(conversationsData => {
                     chatDispatch.setConversationInitialState({ conversationsData, currentUserId: userId });
                  })
                  .catch(logError);
            })
            .finally(() => chatDispatch.setIsFetchingConversations(false));
      }
   });

   $effect(() => {
      if ($connection) {
         $connection?.on('receivemessage', receiveMessageHandler);
         $connection?.on('receivereadmessage', receiveReadMessageHandler);
         $connection?.on('receivemessagestatus', receiveMessageStatusHandler);
         $connection?.on('receivependingmessages', receivePendingMessagesHandler);

         logSuccess('Connection events created.');
      }
   });
</script>

{@render children()}
