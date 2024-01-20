import { writable } from 'svelte/store';

import type { Actions, ChatState, NotificationState } from './chat-store-types';
import { EMessageStatuses } from '../../../../../../enums/EMessageStatuses';
import type { TimestampWithAccount } from '../../../../../../types/message';

export const chatState = writable<ChatState>({
   conversations: [],
   isFetchingConversations: true,
   selectedConversation: null,
   showConversationDetail: false,
});

export const notificationsState = writable<NotificationState>({
   notifications: []
});

export const chatDispatch: Actions = {
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
                  message.received.users = [...message.received.users, { userId, at: new Date() }];

                  if (conversation.participants.length === message.received.users.filter(x => x.at).length) {
                     message.received.byAllAt = new Date();
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
            const targetIndex = store.conversations.findIndex(
               conversationState => conversationState.id === conversation?.id
            );

            if (targetIndex > -1) {
               store.conversations[targetIndex].notifications = 0;
               store.conversations[targetIndex].messages = store.conversations[targetIndex].messages.map(message => {
                  if (message.read.byAllAt === null && message.author.id !== currentUserId) {
                     message.read.users.push({ at: new Date(), userId: currentUserId });
                  }

                  return message;
               });
            }
         }

         // Storing the current value of input at current conversation
         const currentIndex = store.conversations.findIndex(item => item.id === store.selectedConversation?.id);
         if (currentIndex >= 0) {
            store.conversations[currentIndex].typeMessage = typeMessage;
         }

         store.selectedConversation = conversation;

         return store;
      });
   },

   setConversationInitialState({ conversationsData }) {
      chatState.update(store => {
         conversationsData.forEach(conversation => {
            store.conversations.push({
               id: conversation.conversation.id,
               createdAt: conversation.conversation.createdAt,
               groupDescription: conversation.conversation.groupDescription,
               groupName: conversation.conversation.groupName,
               isGroup: !!conversation.conversation.groupId,
               messages: conversation.lastMessages
                  .map(message => ({
                     id: message.id,
                     content: message.content,
                     author: {
                        id: message.authorId,
                        name: '',
                     },
                     writtenAt: message.writtenAt,
                     read: { users: [], byAllAt: message.readByAllAt },
                     received: { users: [], byAllAt: message.receivedByAllAt },
                     repliedMessage: message.repliedMessageId
                        ? {
                             id: message.repliedMessageId,
                             content: '',
                          }
                        : null,
                     sentAt: message.sentAt,
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

   setConversationMessages({ conversationId, messages, fromServer }) {
      chatState.update(store => {
         const index = store.conversations.findIndex(conversation => conversation.id === conversationId);
         const participants = store.conversations[index].participants;

         if (index >= 0) {
            if(fromServer) {
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
                             ? participants.map(user => ({ at: message.readByAllAt!, userId: user.id }))
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
                     repliedMessage: message.repliedMessageId
                        ? {
                             id: message.repliedMessageId,
                             content: '',
                          }
                        : null,
                     sentAt: message.sentAt,
                     conversationId: message.conversationId,
                  }))
                  .toReversed();

            } else {
               store.conversations[index].messages = messages.toReversed();
            }


            store.conversations[index].hasMessagesFetched = true;
         }

         return store;
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

         return { ...store };
      });
   },

   updateConversationMessageStatus(params) {
      const { conversationId, status, userId } = params;

      chatState.update(store => {
         const conversationIndex = store.conversations.findIndex(item => item.id === conversationId);
         const numberOfParticipants = store.conversations[conversationIndex].participants.length;

         if (conversationIndex > -1) {
            store.conversations[conversationIndex].messages = store.conversations[conversationIndex].messages.map(
               message => {
                  if (status === EMessageStatuses.READ && message.read.byAllAt === null) {
                     store.conversations[conversationIndex].notifications = 0;
                     message.read.users.push({ at: new Date(), userId });

                     if (numberOfParticipants === message.read.users.length) {
                        message.read.byAllAt = new Date();
                     }
                  }

                  if (status === EMessageStatuses.RECEIVED && message.id === params.messageId) {
                     message.received.users.push({ at: new Date(), userId });

                     if (numberOfParticipants === message.received.users.length) {
                        message.received.byAllAt = new Date();
                     }
                  }

                  if (status === EMessageStatuses.SENT && message.id === params.messageId) {
                     message.sentAt = new Date();
                  }

                  return message;
               }
            );
         }

         return store;
      });
   },
};
