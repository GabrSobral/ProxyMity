import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { Message } from '@/types/message';
import { Conversation } from '@/types/conversation';
import { GetUserConversationsResponse } from '@/services/api/get-user-conversations';

export interface ConversationState extends Conversation {
	messages: Message[];
	notifications: number;
	typeMessage: string;
	replyMessage: Message | null;
	hasMessagesFetched: boolean;
}

type State = {
	conversations: ConversationState[];
	selectedConversation: ConversationState | null;
	showConversationDetail: boolean;
};

type Actions = {
	addConversation(Conversation: ConversationState): void;
	selectConversation(Conversation: ConversationState | null): void;
	bringToTop(ConversationId: ConversationState['id']): void;
	handleShowConversationDetail(): void;

	addMessage(payload: { conversationId: string; message: Message; shouldNotification?: boolean }): void;
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

export const useChatsStore = create(
	immer<State & Actions>(set => ({
		conversations: [],
		selectedConversation: null,
		showConversationDetail: false,

		addConversation: conversationState =>
			set((store: State) => {
				store.conversations = [conversationState, ...store.conversations];
			}),

		selectConversation: conversationState =>
			set((store: State) => {
				if (conversationState) {
					const index = store.conversations.findIndex(conversation => conversation.id === conversationState?.id);
					store.conversations[index].notifications = 0;
				}

				store.selectedConversation = conversationState;
			}),

		bringToTop: conversationId =>
			set((store: State) => {
				if (store.conversations.length <= 1 || conversationId === store.conversations[0]?.id) {
					return;
				}

				store.conversations = store.conversations.sort((first, second) =>
					first.id === conversationId ? -1 : second.id === conversationId ? 1 : 0
				);
			}),

		handleShowConversationDetail: () =>
			set((store: State) => {
				store.showConversationDetail = !store.showConversationDetail;
			}),

		addMessage: ({ conversationId, message, shouldNotification }) =>
			set((store: State) => {
				const index = store.conversations.findIndex(conversation => conversation.id === conversationId);

				if (index >= 0) {
					if (store.selectedConversation?.id === store.conversations[index].id) {
						store.selectedConversation.messages.push(message);

						if (store.selectedConversation.messages.length > 100) {
							store.selectedConversation.messages.shift();
						}
					}

					store.conversations[index].messages.push(message);

					const currentNotifications = store.conversations[index].notifications;
					store.conversations[index].notifications = shouldNotification ? currentNotifications + 1 : 0;

					if (store.conversations[index].messages.length > 100) {
						store.conversations[index].messages.shift();
					}
				}
			}),

		setConversationMessages: ({ conversationId, messages }) =>
			set((store: State) => {
				const index = store.conversations.findIndex(conversation => conversation.id === conversationId);

				if (index >= 0) {
					store.conversations[index].messages = messages;
					store.conversations[index].hasMessagesFetched = true;
					store.selectedConversation && (store.selectedConversation.messages = messages);
				}
			}),

		updateConversationMessageStatus: params =>
			set((store: State) => {
				const { conversationId, status } = params;
				const conversationIndex = store.conversations.findIndex(item => item.id === conversationId);

				if (conversationIndex > -1) {
					store.conversations[conversationIndex].messages = store.conversations[conversationIndex].messages.map(
						message => {
							if (status === 'read' && message.conversationId !== conversationId) {
								store.conversations[conversationIndex].notifications = 0;
								message.readByAllAt = new Date();

								return message;
							}

							if (status === 'received' && message.id === params.messageId) {
								message.receivedByAllAt = new Date();
							}

							if (status === 'sent' && message.id === params.messageId) {
								message.sentAt = new Date();
							}

							return message;
						}
					);
				}
			}),

		setConversationInitialState: ({ conversationsData, userId }) =>
			set((store: State) => {
				conversationsData.forEach(conversation => {
					store.conversations.push({
						...conversation,
						messages: conversation.lastMessages,
						notifications: conversation.unreadMessagesCount,
						participants: conversation.participants.filter(item => item.id !== userId),
						replyMessage: null,
						typeMessage: '',
						hasMessagesFetched: false,
					});
				});
			}),

		saveTypeMessageFromConversation: ({ conversationId, typeMessage }) =>
			set((store: State) => {
				const conversationIndex = store.conversations.findIndex(item => item.id === conversationId);

				if (conversationIndex >= 0) {
					store.conversations[conversationIndex].typeMessage = typeMessage;
				}
			}),

		setReplyMessageFromConversation: ({ conversationId, message }) =>
			set((store: State) => {
				const conversationIndex = store.conversations.findIndex(item => item.id === conversationId);

				if (conversationIndex >= 0) {
					store.conversations[conversationIndex].replyMessage = message;
				}
			}),

		removeReplyMessageFromConversation: ({ conversationId }) =>
			set((store: State) => {
				const conversationIndex = store.conversations.findIndex(item => item.id === conversationId);

				if (conversationIndex >= 0) {
					store.conversations[conversationIndex].replyMessage = null;
				}
			}),
	}))
);
