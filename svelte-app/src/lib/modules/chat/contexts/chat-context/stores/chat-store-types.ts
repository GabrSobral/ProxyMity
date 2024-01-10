import type { ILocalMessage } from '../../../../../../types/message';
import type { Conversation } from '../../../../../../types/conversation';
import type { GetUserConversationsResponse } from '../../../../../../services/api/get-user-conversations';
import type { EMessageStatuses } from '../../../../../../enums/EMessageStatuses';

export interface ConversationState extends Conversation {
	messages: ILocalMessage[];
	notifications: number;
	typeMessage: string;
	replyMessage: ILocalMessage | null;
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

	addMessage(payload: { message: ILocalMessage }): void;
	setConversationMessages(payload: { conversationId: string; messages: ILocalMessage[] }): void;
	updateConversationMessageStatus(
		payload:
			| {
					conversationId: string;
					messageId: string;
					status: EMessageStatuses.SENT | EMessageStatuses.RECEIVED;
					userId: string;
			  }
			| { conversationId: string; status: EMessageStatuses.READ; userId: string }
	): void;
	setConversationInitialState(payload: { conversationsData: GetUserConversationsResponse }): void;
	saveTypeMessageFromConversation(payload: { conversationId: string; typeMessage: string }): void;
	setReplyMessageFromConversation(payload: { conversationId: string; message: ILocalMessage }): void;
	removeReplyMessageFromConversation(payload: { conversationId: string }): void;
};
