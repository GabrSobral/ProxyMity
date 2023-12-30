import type { Message } from '../../../../../../types/message';
import type { Conversation } from '../../../../../../types/conversation';
import type { GetUserConversationsResponse } from '../../../../../../services/api/get-user-conversations';

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
	selectConversation(Conversation: ConversationState | null): void;
	bringToTop(ConversationId: ConversationState['id']): void;
	handleShowConversationDetail(): void;

	addMessage(payload: { message: Message; shouldNotification?: boolean }): void;
	setConversationMessages(payload: { conversationId: string; messages: Message[] }): void;
	updateConversationMessageStatus(
		payload:
			| {
					conversationId: string;
					messageId: string;
					status: 'sent' | 'received';
			  }
			| { conversationId: string; status: 'read' }
	): void;
	setConversationInitialState(payload: { conversationsData: GetUserConversationsResponse; userId: string }): void;
	saveTypeMessageFromConversation(payload: { conversationId: string; typeMessage: string }): void;
	setReplyMessageFromConversation(payload: { conversationId: string; message: Message }): void;
	removeReplyMessageFromConversation(payload: { conversationId: string }): void;
};
