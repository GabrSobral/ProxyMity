import { writable } from 'svelte/store';

import type { Actions, ChatState, NotificationState } from './chat-store-types';
import { EMessageStatuses } from '../../../../../../enums/EMessageStatuses';
import type { TimestampWithAccount } from '../../../../../../types/message';
import { logDebug } from '../../../../../../utils/logging';

export const chatState = writable<ChatState>({
   conversations: [],
   isFetchingConversations: true,
   selectedConversation: null,
   showConversationDetail: false,
});

export const notificationsState = writable<NotificationState>({
   notifications: [],
});

export const chatDispatch: Actions = {
   handleConversationPin({ conversationId }) {
      chatState.update(store => ({
         ...store,
         conversations: store.conversations.map(conversation => {
            if (conversation.id === conversationId) {
               conversation.conversationPinnedAt = conversation.conversationPinnedAt ? null : new Date();
            }

            return conversation;
         }),
      }));
   },

   setIsFetchingConversations(value) {
      chatState.update(store => ({
         ...store,
         isFetchingConversations: value,
      }));
   },

   addConversation(newConversation) {
      chatState.update(store => ({
         ...store,
         conversations: [newConversation, ...store.conversations],
      }));
   },

   markAsReceivedMessagesFromConversations({ userId }) {
      chatState.update(store => {
         store.conversations = store.conversations.map(conversation => {
            if (conversation.participants.some(participant => participant.id === userId)) {
               conversation.messages = conversation.messages.map(message => {
                  if (!message.received.users.find(user => user.userId === userId)) {
                     message.received.users = [...message.received.users, { userId, at: new Date() }];

                     if (conversation.participants.length === message.received.users.filter(x => x.at).length) {
                        message.received.byAllAt = new Date();
                     }
                  }

                  return message;
               });
            }

            return conversation;
         });
         return store;
      });
   },

   updateUsersFromMessageStatus({ message, users }) {
      chatState.update(store => {
         const index = store.conversations.findIndex(conversation => conversation.id === message.conversationId);

         if (index >= 0) {
            if (store.conversations[index].isGroup) {
               store.conversations[index].messages = store.conversations[index].messages.map(item => {
                  if (item.id === message.id) {
                     const read: TimestampWithAccount[] = users
                        .filter(user => user.readAt)
                        .map(user => ({ at: user.readAt!, userId: user.userId }));
                     const received: TimestampWithAccount[] = users
                        .filter(user => user.receivedAt)
                        .map(user => ({ at: user.receivedAt!, userId: user.userId }));

                     item.read.users = read;
                     item.received.users = received;
                  }

                  return item;
               });
            } else {
               store.conversations[index].messages = store.conversations[index].messages.map(item => {
                  if (item.id === message.id) {
                     item.read.users = store.conversations[index].participants.map(participant => ({
                        userId: participant.id,
                        at: message.read.byAllAt,
                     }));

                     item.received.users = store.conversations[index].participants.map(participant => ({
                        userId: participant.id,
                        at: message.received.byAllAt,
                     }));
                  }

                  return item;
               });
            }
         }

         return store;
      });
   },

   addMessage({ message }) {
      logDebug('chat store -> addMessage');

      chatState.update(store => {
         const index = store.conversations.findIndex(conversation => conversation.id === message.conversationId);

         if (index >= 0) {
            store.conversations[index].messages.push(message);

            const shouldNotification = store.selectedConversation?.id !== message.conversationId;
            const currentNotifications = store.conversations[index].notifications;
            store.conversations[index].notifications = shouldNotification ? currentNotifications + 1 : 0;

            if (store.conversations[index].messages.length > 100) {
               store.conversations[index].messages.shift();
            }
         }

         return store;
      });
   },

   bringToTop(conversationId) {
      chatState.update(store => {
         if (store.conversations.length <= 1 || conversationId === store.conversations[0]?.id) {
            return store;
         }

         store.conversations = store.conversations.sort((first, second) =>
            first.id === conversationId ? -1 : second.id === conversationId ? 1 : 0
         );

         return store;
      });
   },

   handleShowConversationDetail() {
      chatState.update(store => {
         store.showConversationDetail = !store.showConversationDetail;

         return store;
      });
   },

   removeReplyMessageFromConversation({ conversationId }) {
      chatState.update(store => {
         const conversationIndex = store.conversations.findIndex(item => item.id === conversationId);

         if (conversationIndex >= 0) {
            store.conversations[conversationIndex].replyMessage = null;
         }

         return store;
      });
   },

   selectConversation({ conversation, typeMessage, currentUserId }) {
      chatState.update(store => {
         if (conversation) {
            const targetIndex = store.conversations.findIndex(item => item.id === conversation?.id);

            if (targetIndex > -1) {
               // Reset notifications and update messages read status
               store.conversations[targetIndex].notifications = 0;
               store.conversations[targetIndex].messages = store.conversations[targetIndex].messages.map(message => {
                  const numberOfParticipants = store.conversations[targetIndex].participants.length;
                  const currentUserAlreadyRead = store.conversations[targetIndex].isGroup
                     ? message.read.users.some(read => read.userId === currentUserId)
                     : !!message.read.byAllAt;

                  if (!currentUserAlreadyRead && message.author.id !== currentUserId) {
                     message.read.users.push({ at: new Date(), userId: currentUserId });

                     if (!message.read.byAllAt && numberOfParticipants === message.read.users.length)
                        message.read.byAllAt = new Date();
                  }

                  return { ...message }; // using spread operator to ensure that the state will be updated.
               });
            }
         }

         const currentIndex = store.conversations.findIndex(item => item.id === store.selectedConversation?.id);
         if (currentIndex >= 0) {
            store.conversations[currentIndex].typeMessage = typeMessage;
         }

         store.selectedConversation = conversation;

         return { ...store };
      });
   },

   setConversationInitialState({ conversationsData, currentUserId }) {
      chatState.update(store => {
         conversationsData.forEach(conversation => {
            store.conversations.push({
               id: conversation.conversation.id,
               createdAt: conversation.conversation.createdAt,
               groupDescription: conversation.conversation.groupDescription,
               groupName: conversation.conversation.groupName,
               isGroup: !!conversation.conversation.groupId,
               conversationPinnedAt: conversation.conversation.conversationPinnedAt,
               messages: conversation.lastMessages
                  .map(message => ({
                     id: message.id,
                     content: message.content,
                     author: {
                        id: message.authorId,
                        name: conversation.participants.find(item => item.id === message.authorId)?.name || '',
                     },
                     writtenAt: message.writtenAt,
                     sentAt: message.sentAt,
                     received: {
                        byAllAt: message.receivedByAllAt,
                        users: conversation.conversation.groupId
                           ? []
                           : message.receivedByAllAt
                             ? [{ at: message.receivedByAllAt!, userId: currentUserId }]
                             : [],
                     },
                     read: {
                        byAllAt: message.readByAllAt,
                        users: conversation.conversation.groupId
                           ? []
                           : message.readByAllAt
                             ? [{ at: message.readByAllAt!, userId: currentUserId }]
                             : [],
                     },
                     repliedMessage: message.repliedMessage,
                     conversationId: message.conversationId,
                  }))
                  .toReversed(),
               notifications: conversation.unreadMessagesCount,
               participants: conversation.participants,
               replyMessage: null,
               typeMessage: '',
               hasMessagesFetched: false,
            });
         });

         return store;
      });
   },

   setConversationMessages({ conversationId, messages, fromServer, currentUserId }) {
      chatState.update(store => {
         const index = store.conversations.findIndex(conversation => conversation.id === conversationId);
         const participants = store.conversations[index].participants;

         if (index >= 0) {
            if (fromServer) {
               store.conversations[index].messages = messages
                  .map(message => ({
                     id: message.id,
                     content: message.content,
                     author: {
                        id: message.authorId,
                        name: participants.find(user => user.id === message.authorId)?.name || 'You',
                     },
                     writtenAt: message.writtenAt,
                     read: {
                        byAllAt: message.readByAllAt,
                        users: store.conversations[index].isGroup
                           ? []
                           : message.readByAllAt
                             ? [{ at: message.readByAllAt!, userId: currentUserId }]
                             : [],
                     },
                     received: {
                        byAllAt: message.receivedByAllAt,
                        users: store.conversations[index].isGroup
                           ? []
                           : message.receivedByAllAt
                             ? participants.map(user => ({ at: message.receivedByAllAt!, userId: user.id }))
                             : [],
                     },
                     repliedMessage: message.repliedMessage,
                     sentAt: message.sentAt,
                     conversationId: message.conversationId,
                  }))
                  .toReversed();
            } else {
               store.conversations[index].messages = messages.toReversed();
            }

            store.conversations[index].hasMessagesFetched = true;
         }

         return { ...store };
      });
   },

   setReplyMessageFromConversation({ conversationId, message }) {
      chatState.update(store => {
         const conversationIndex = store.conversations.findIndex(item => item.id === conversationId);

         if (conversationIndex >= 0) {
            store.conversations[conversationIndex].replyMessage = message;
         }

         return store;
      });
   },

   saveTypeMessageFromConversation({ conversationId, typeMessage }) {
      chatState.update(store => {
         const conversationIndex = store.conversations.findIndex(item => item.id === conversationId);

         if (conversationIndex >= 0) {
            store.conversations[conversationIndex].typeMessage = typeMessage;
         }

         return store;
      });
   },

   updateConversationMessageStatus(params) {
      const { conversationId, status, userId, appliedForAll } = params;

      chatState.update(store => {
         const conversationIndex = store.conversations.findIndex(item => item.id === conversationId);

         if (conversationIndex > -1) {
            store.conversations[conversationIndex].messages = store.conversations[conversationIndex].messages.map(message => {
               if (status === EMessageStatuses.SENT && message.id === params.messageId) {
                  message.sentAt = new Date();
               }

               const readOrReceived: 'received' | 'read' | '' =
                  status === EMessageStatuses.READ ? 'read' : status === EMessageStatuses.RECEIVED ? 'received' : '';

               if (readOrReceived && message[readOrReceived].byAllAt === null) {
                  message[readOrReceived].users.push({ at: new Date(), userId });

                  if (appliedForAll) {
                     message[readOrReceived].byAllAt = new Date();
                  }
               }

               return message;
            });
         }

         return store;
      });
   },
};
