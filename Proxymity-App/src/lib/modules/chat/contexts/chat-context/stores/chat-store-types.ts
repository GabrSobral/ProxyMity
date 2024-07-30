import type { EMessageStatuses } from '../../../../../../enums/EMessageStatuses';
import type { GetUserConversationsResponse } from '../../../../../../services/api/get-user-conversations';

import type { Conversation } from '../../../../../../types/conversation';
import type { INotification } from '../../../../../../types/notification';
import type { ILocalMessage, IServerMessage } from '../../../../../../types/message';

export interface ConversationState extends Conversation {
   messages: ILocalMessage[];
   notifications: number;
   typeMessage: string;
   replyMessage: ILocalMessage | null;
   hasMessagesFetched: boolean;
   typing: {
      authorId: string;
      isTyping: boolean;
   }[];
}

export type ChatState = {
   conversations: ConversationState[];
   isFetchingConversations: boolean;
   selectedConversation: ConversationState | null;
   showConversationDetail: boolean;
};

export type NotificationState = {
   notifications: INotification[];
   lastMessagesHistory: {
      messageId: ILocalMessage['id'] | null;
      authorId: string;
      conversationId: Conversation['id'];
   }[];
};

export type Actions = {
   addConversation(Conversation: ConversationState): void;
   selectConversation(params: { conversation: ConversationState | null; typeMessage: string; currentUserId: string }): void;
   bringToTop(ConversationId: ConversationState['id']): void;
   handleShowConversationDetail(): void;
   setIsFetchingConversations(value: boolean): void;
   addMessage(payload: { message: ILocalMessage }): void;
   handleConversationPin(payload: { conversationId: string }): void;
   handleIsConversationTyping(payload: { conversationId: string; isTyping: boolean; authorId: string }): void;
   setConversationMessages(
      payload:
         | { conversationId: string; messages: IServerMessage[]; fromServer: true; currentUserId: string }
         | { conversationId: string; messages: ILocalMessage[]; fromServer: false; currentUserId: string }
   ): void;
   updateConversationMessageStatus(
      payload:
         | {
              conversationId: string;
              messageId: string;
              status: EMessageStatuses.SENT | EMessageStatuses.RECEIVED;
              userId: string;
              appliedForAll: boolean;
           }
         | { conversationId: string; status: EMessageStatuses.READ; userId: string; appliedForAll: boolean }
   ): void;
   setConversationInitialState(payload: { conversationsData: GetUserConversationsResponse; currentUserId: string }): void;
   saveTypeMessageFromConversation(payload: { conversationId: string; typeMessage: string }): void;
   setReplyMessageFromConversation(payload: { conversationId: string; message: ILocalMessage }): void;
   removeReplyMessageFromConversation(payload: { conversationId: string }): void;
   updateUsersFromMessageStatus(payload: {
      message: ILocalMessage;
      users: { readAt: Date | null; receivedAt: Date | null; userId: string }[];
   }): void;

   markAsReceivedMessagesFromConversations(params: { userId: string }): void;
};
