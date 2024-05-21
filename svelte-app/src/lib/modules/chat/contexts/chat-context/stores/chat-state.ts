import { logDebug } from '../../../../../../utils/logging';
import { EMessageStatuses } from '../../../../../../enums/EMessageStatuses';

import type { Actions, ChatState } from './chat-store-types';
import type { TimestampWithAccount } from '../../../../../../types/message';

export let chatState = $state<ChatState>({
   conversations: [],
   isFetchingConversations: true,
   selectedConversation: null,
   showConversationDetail: false,
});

export const chatDispatch: Actions = {
   handleConversationPin({ conversationId }) {
      chatState.conversations = chatState.conversations.map(conversation => {
         if (conversation.id === conversationId) {
            conversation.conversationPinnedAt = conversation.conversationPinnedAt ? null : new Date();
         }

         return conversation;
      });
   },

   setIsFetchingConversations(value) {
      chatState.isFetchingConversations = value;
   },

   addConversation(newConversation) {
      chatState.conversations = [newConversation, ...chatState.conversations];
   },

   markAsReceivedMessagesFromConversations({ userId }) {
      chatState.conversations = chatState.conversations.map(conversation => {
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
   },

   updateUsersFromMessageStatus({ message, users }) {
      const index = chatState.conversations.findIndex(conversation => conversation.id === message.conversationId);

      if (index >= 0) {
         if (chatState.conversations[index].isGroup) {
            chatState.conversations[index].messages = chatState.conversations[index].messages.map(item => {
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
            chatState.conversations[index].messages = chatState.conversations[index].messages.map(item => {
               if (item.id === message.id) {
                  item.read.users = chatState.conversations[index].participants.map(participant => ({
                     userId: participant.id,
                     at: message.read.byAllAt,
                  }));

                  item.received.users = chatState.conversations[index].participants.map(participant => ({
                     userId: participant.id,
                     at: message.received.byAllAt,
                  }));
               }

               return item;
            });
         }
      }
   },

   addMessage({ message }) {
      logDebug('chat store -> addMessage');

      const index = chatState.conversations.findIndex(conversation => conversation.id === message.conversationId);

      if (index >= 0) {
         chatState.conversations[index].messages.push(message);

         const shouldNotification = chatState.selectedConversation?.id !== message.conversationId;
         const currentNotifications = chatState.conversations[index].notifications;
         chatState.conversations[index].notifications = shouldNotification ? currentNotifications + 1 : 0;

         if (chatState.conversations[index].messages.length > 100) {
            chatState.conversations[index].messages.shift();
         }
      }
   },

   bringToTop(conversationId) {
      if (chatState.conversations.length <= 1 || conversationId === chatState.conversations[0]?.id) {
         return chatState;
      }

      chatState.conversations = chatState.conversations.sort((first, second) =>
         first.id === conversationId ? -1 : second.id === conversationId ? 1 : 0
      );
   },

   handleShowConversationDetail() {
      chatState.showConversationDetail = !chatState.showConversationDetail;
   },

   removeReplyMessageFromConversation({ conversationId }) {
      const conversationIndex = chatState.conversations.findIndex(item => item.id === conversationId);

      if (conversationIndex >= 0) {
         chatState.conversations[conversationIndex].replyMessage = null;
      }
   },

   selectConversation({ conversation, typeMessage, currentUserId }) {
      if (conversation) {
         const targetIndex = chatState.conversations.findIndex(item => item.id === conversation?.id);

         if (targetIndex > -1) {
            // Reset notifications and update messages read status
            chatState.conversations[targetIndex].notifications = 0;
            chatState.conversations[targetIndex].messages = chatState.conversations[targetIndex].messages.map(message => {
               const numberOfParticipants = chatState.conversations[targetIndex].participants.length;
               const currentUserAlreadyRead = chatState.conversations[targetIndex].isGroup
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

      const currentIndex = chatState.conversations.findIndex(item => item.id === chatState.selectedConversation?.id);
      if (currentIndex >= 0) {
         chatState.conversations[currentIndex].typeMessage = typeMessage;
      }

      chatState.selectedConversation = conversation;
   },

   setConversationInitialState({ conversationsData, currentUserId }) {
      conversationsData.forEach(conversation => {
         chatState.conversations.push({
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
   },

   setConversationMessages({ conversationId, messages, fromServer, currentUserId }) {
      const index = chatState.conversations.findIndex(conversation => conversation.id === conversationId);
      const participants = chatState.conversations[index].participants;

      if (index >= 0) {
         if (fromServer) {
            chatState.conversations[index].messages = messages
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
                     users: chatState.conversations[index].isGroup
                        ? []
                        : message.readByAllAt
                          ? [{ at: message.readByAllAt!, userId: currentUserId }]
                          : [],
                  },
                  received: {
                     byAllAt: message.receivedByAllAt,
                     users: chatState.conversations[index].isGroup
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
            chatState.conversations[index].messages = messages.toReversed();
         }

         chatState.conversations[index].hasMessagesFetched = true;
      }
   },

   setReplyMessageFromConversation({ conversationId, message }) {
      const conversationIndex = chatState.conversations.findIndex(item => item.id === conversationId);

      if (conversationIndex >= 0) {
         chatState.conversations[conversationIndex].replyMessage = message;
      }
   },

   saveTypeMessageFromConversation({ conversationId, typeMessage }) {
      const conversationIndex = chatState.conversations.findIndex(item => item.id === conversationId);

      if (conversationIndex >= 0) {
         chatState.conversations[conversationIndex].typeMessage = typeMessage;
      }
   },

   updateConversationMessageStatus(params) {
      const { conversationId, status, userId, appliedForAll } = params;

      const conversationIndex = chatState.conversations.findIndex(item => item.id === conversationId);

      if (conversationIndex > -1) {
         chatState.conversations[conversationIndex].messages = chatState.conversations[conversationIndex].messages.map(
            message => {
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
            }
         );
      }
   },
};
