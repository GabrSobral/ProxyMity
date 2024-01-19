<script lang="ts" context="module">
   export let typebarRef = writable<HTMLInputElement | null>(null);

   let chatStateModule: ChatState;
   let connectionModule: HubConnection | null;
   let userModule: Session['user'] | undefined;
   let accessToken: string;
   let typebarRefModule: HTMLInputElement | null;

   chatState.subscribe(value => {
      chatStateModule = value;
   });

   connection.subscribe(value => { connectionModule = value });

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
         sendReadMessageWebSocketEvent(connectionModule, {
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
            chatDispatch.setConversationMessages({ conversationId: conversation.id, messages: messages });
         } catch (error) {
            console.error('Error fetching conversations, data will be taken from the cache', error);

            const messages = await getConversationsMessagesAsyncDB(conversation.id);
            chatDispatch.setConversationMessages({ conversationId: conversation.id, messages: messages.toReversed() });
         }
      }
   }

   interface ChatContextProps {
      typebarRef: Writable<HTMLInputElement | null>;
      selectedConversationAsync: (conversation: ConversationState) => Promise<void>;
   }

   export const getChatContext = () => getContext<ChatContextProps>('chat-context');
   export const setChatContext = () =>
      setContext<ChatContextProps>('chat-context', {
         typebarRef,
         selectedConversationAsync,
      });
</script>

<script lang="ts">
   import { page } from '$app/stores';
   import { toast } from "svelte-sonner";
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

   import { addMessageAsyncDB } from '../../../../../services/database/use-cases/add-message';
   import { saveConversationsAsyncDB } from '../../../../../services/database/use-cases/save-conversations';
   import { getConversationCacheAsyncDB } from '../../../../../services/database/use-cases/get-conversations-state';
   import { getConversationsMessagesAsyncDB } from '../../../../../services/database/use-cases/get-conversations-messages';
   import { readConversationMessagesAsyncDB } from '../../../../../services/database/use-cases/read-conversation-messages';

   import { connection } from '../websocket-context/stores/connection';
   import { sendReadMessageWebSocketEvent } from '../websocket-context/emmiters/sendReadMessage';
   import { sendReceiveMessageWebSocketEvent } from '../websocket-context/emmiters/sendReceiveMessage';

   import type { ILocalMessage, IServerMessage } from '../../../../../types/message';
   import { EMessageStatuses } from '../../../../../enums/EMessageStatuses';
   import { getMessageByIdAsyncDB } from '../../../../../services/database/use-cases/get-message-by-id';

   setChatContext();

   $: session = $page.data.session;

   onMount(() => {
      if (session?.user && session?.accessToken) {
         const user = session?.user;

         chatDispatch.setIsFetchingConversations(true);

         APIGetUserConversations({ id: user.id }, { accessToken: session.accessToken })
            .then(conversationsData => {
               console.log('🟢 Fetching conversations data was successfully.');

               const filteredData = conversationsData.map(data => ({
                  ...data,
                  participants: data.participants.filter(item => item.id !== user.id),
               }));

               chatDispatch.setConversationInitialState({ conversationsData: filteredData });

               saveConversationsAsyncDB(filteredData)
               	.then(() => console.log('🟢 Local database was successfully synchronized with API data.'))
               	.catch(error =>
               		console.error('🔴 Error on try to synchronize API data with local database', error.message)
               	);
            })
            .catch(error => {
               console.error(
                  '🔴 Error on trying to fetch conversations, data will be taken from the cache',
                  error.message
               );

               getConversationCacheAsyncDB({ userId: user.id })
               	.then(conversationsData => chatDispatch.setConversationInitialState({ conversationsData, userId: user.id }))
               	.catch(console.error);
            }).finally(() => chatDispatch.setIsFetchingConversations(false));
      }
   });

   async function receiveMessageHandler(message: IServerMessage) {
      if (!message || !session?.user || !$connection) {
         return;
      }

      const webSocketsPayload = {
         userId: session?.user.id,
         conversationId: message.conversationId,
         messageId: message.id,
         isConversationGroup: $chatState.selectedConversation?.isGroup || false,
      };

      if ($chatState.selectedConversation && $chatState.selectedConversation?.id === message.conversationId) {
         sendReceiveMessageWebSocketEvent($connection, webSocketsPayload);
         sendReadMessageWebSocketEvent($connection, webSocketsPayload);
      } else {
         const messageConversation = $chatState.conversations.find(item => item.id === message.conversationId);

         toast.message("New message", {
            description: message.content,
            action: {
               label: "Open",
               onClick: () => {
                  const conversation = $chatState.conversations.find(item => item.id === message.conversationId);

                  if(conversation){
                     selectedConversationAsync(conversation);
                  }
               }
            }
         })

         if (messageConversation && $connection)
            sendReceiveMessageWebSocketEvent($connection, {
               ...webSocketsPayload,
               isConversationGroup: messageConversation?.isGroup,
            });
      }

      const payload: ILocalMessage = await (async () => ({
         id: message.id,
         content: message.content,
         conversationId: message.conversationId,
         writtenAt: message.writtenAt,
         author: {
            id: message.authorId,
            name: 'name',
         },
         repliedMessage: message.repliedMessageId
            ? {
                 id: message.repliedMessageId,
                 content: await (async () => {
                     const repliedMessage = await getMessageByIdAsyncDB(message.repliedMessageId!);
                     return repliedMessage?.content || "";
                 })(),
              }
            : null,
         received: { byAllAt: message.receivedByAllAt, users: [] },
         sentAt: message.sentAt,
         read: { byAllAt: message.readByAllAt, users: [] },
         // readByAllAt: $chatState.selectedConversation?.id === message.conversationId ? new Date() : null,
      }))();

      chatDispatch.addMessage({ message: payload });
      chatDispatch.bringToTop(message.conversationId);

      addMessageAsyncDB(payload);
   }

   async function receiveReadMessageHandler(userId: string, conversationId: string, isConversationGroup: boolean) {
      if (!session?.user) return;

      chatDispatch.updateConversationMessageStatus({ conversationId, status: EMessageStatuses.READ, userId });
      readConversationMessagesAsyncDB({ conversationId, myId: session?.user?.id, whoRead: userId, isConversationGroup });
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
      console.log('Receiving pending messages', { userId });

      chatDispatch.markAsReceivedMessagesFromConversations({ userId });
   }

   $: if ($connection) {
      $connection?.on('receivemessage', receiveMessageHandler);
      $connection?.on('receivereadmessage', receiveReadMessageHandler);
      $connection?.on('receivemessagestatus', receiveMessageStatusHandler);
      $connection?.on('receivependingmessages', receivePendingMessagesHandler);
   }
</script>

<slot />
