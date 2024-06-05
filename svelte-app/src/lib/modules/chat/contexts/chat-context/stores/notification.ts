import { writable } from 'svelte/store';

import type { ConversationState, NotificationState } from './chat-store-types';

export const notificationsState = writable<NotificationState>({
   notifications: [],
   lastMessagesHistory: [],
});

export type Actions = {
   updateLastMessagesHistory(selectedConversation: ConversationState | null, currentUserId: string): void;
   clearLastMessagesHistoryFromConversation(selectedConversation: ConversationState | null): void;
};

export const notificationsDispatch: Actions = {
   clearLastMessagesHistoryFromConversation(selectedConversation) {
      notificationsState.update(state => {
         const index = state.lastMessagesHistory.findIndex(item => item.conversationId === selectedConversation?.id);

         if (index > -1) {
            state.lastMessagesHistory[index].messageId = null;
         }

         return { ...state };
      });
   },
   updateLastMessagesHistory(selectedConversation, currentUserId) {
      notificationsState.update(state => {
         const index = state.lastMessagesHistory.findIndex(item => item.conversationId === selectedConversation?.id);
         const unreadMessagesCount = selectedConversation?.notifications || 0;

         if (unreadMessagesCount === 0) {
            if (index > -1 && selectedConversation?.id) {
               state.lastMessagesHistory[index].messageId = null;
            }

            return state;
         }

         const lastMessageIndex = selectedConversation ? selectedConversation.messages.length - unreadMessagesCount : -1;
         const lastUnreadMessage = selectedConversation?.messages[lastMessageIndex];

         if (!lastUnreadMessage) {
            return state;
         }

         if (index > -1 && selectedConversation?.id) {
            state.lastMessagesHistory[index].messageId = lastUnreadMessage?.id || null;
            state.lastMessagesHistory[index].authorId = lastUnreadMessage?.author.id;
         } else if (selectedConversation?.id) {
            state.lastMessagesHistory.push({
               conversationId: selectedConversation.id,
               messageId: lastUnreadMessage?.id || null,
               authorId: lastUnreadMessage?.author.id,
            });
         }

         return { ...state };
      });
   },
};
