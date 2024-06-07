import type { EMessageStatuses } from '../../../../../enums/EMessageStatuses';
import type { Conversation } from '../../../../../types/conversation';

export interface IChangeMessageStatusParams {
   messageId: string;
   status: EMessageStatuses;
}

export interface IReadContactMessagesParams {
   conversationId: Conversation['id'];
   whoRead: string;
   myId: string;
   isConversationGroup: boolean;
}

export enum WorkerMethods {
   ADD_MESSAGE = "addMessage",
   GET_CURRENT_USER = "getCurrentUser",
   GET_MESSAGE_BY_ID = "getMessageById",
   CHANGE_MESSAGE_STATUS = "changeMessageStatus",
   READ_CONVERSATION_MESSAGES = "readConversationMessages",
   SAVE_CONVERSATIONS = "saveConversations",
   SAVE_USER = "saveUser"
}
