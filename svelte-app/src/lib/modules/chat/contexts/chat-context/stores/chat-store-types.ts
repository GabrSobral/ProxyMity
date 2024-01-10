import type { Message } from '../../../../../../types/message';
import type { Conversation } from '../../../../../../types/conversation';
import type { GetUserConversationsResponse } from '../../../../../../services/api/get-user-conversations';
import type { EMessageStatuses } from '../../../../../../enums/EMessageStatuses';

export interface ConversationState extends Conversation {
	messages: Message[];
	notifications: number;
	typeMessage: string;
	replyMessage: Message | null;
	hasMessagesFetched: boolean;
}

export type State = {
	conversations: ConversationState[];
	selectedConversation: ConversationState | null;
	showConversationDetail: boolean;
};

export type Actions = {
	addConversation(Conversation: ConversationState): void;
	selectConversation(params: {
		conversation: ConversationState | null;
		typeMessage: string;
		currentUserId: string;
	}): void;
	bringToTop(ConversationId: ConversationState['id']): void;
	handleShowConversationDetail(): void;

	addMessage(payload: { message: Message }): void;
	setConversationMessages(payload: { conversationId: string; messages: Message[] }): void;
	updateConversationMessageStatus(
		payload:
			| {
					conversationId: string;
					messageId: string;
					status: EMessageStatuses.SENT | EMessageStatuses.RECEIVED;
			  }
			| { conversationId: string; status: EMessageStatuses.READ }
	): void;
	setConversationInitialState(payload: { conversationsData: GetUserConversationsResponse }): void;
	saveTypeMessageFromConversation(payload: { conversationId: string; typeMessage: string }): void;
	setReplyMessageFromConversation(payload: { conversationId: string; message: Message }): void;
	removeReplyMessageFromConversation(payload: { conversationId: string }): void;
};
