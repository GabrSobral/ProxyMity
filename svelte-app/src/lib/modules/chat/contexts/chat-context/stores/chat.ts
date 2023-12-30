import { writable } from 'svelte/store';

import type { Actions, State } from './chat-store-types';

export const chatState = writable<State>({
	conversations: [],
	selectedConversation: null,
	showConversationDetail: false,
});

export const chatDispatch: Actions = {
	addConversation(newConversation) {
		chatState.update(store => ({
			...store,
			conversations: [newConversation, ...store.conversations],
		}));
	},

	addMessage({ message, shouldNotification }) {
		chatState.update(store => {
			const index = store.conversations.findIndex(conversation => conversation.id === message.conversationId);
			if (index >= 0) {
				store.conversations[index].messages.push(message);

				const currentNotifications = store.conversations[index].notifications;
				store.conversations[index].notifications = shouldNotification ? currentNotifications + 1 : 0;

				if (store.conversations[index].messages.length > 100) {
					store.conversations[index].messages.shift();
				}
			}

			return { ...store };
		});
	},

	bringToTop(conversationId) {
		chatState.update(store => {
			if (store.conversations.length <= 1 || conversationId === store.conversations[0]?.id) {
				return { ...store };
			}

			store.conversations = store.conversations.sort((first, second) =>
				first.id === conversationId ? -1 : second.id === conversationId ? 1 : 0
			);

			return { ...store };
		});
	},

	handleShowConversationDetail() {
		chatState.update(store => {
			store.showConversationDetail = !store.showConversationDetail;

			return { ...store };
		});
	},

	removeReplyMessageFromConversation({ conversationId }) {
		chatState.update(store => {
			const conversationIndex = store.conversations.findIndex(item => item.id === conversationId);

			if (conversationIndex >= 0) {
				store.conversations[conversationIndex].replyMessage = null;
			}

			return { ...store };
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

	selectConversation(selectedConversation) {
		chatState.update(store => {
			if (selectedConversation) {
				const index = store.conversations.findIndex(conversation => conversation.id === selectedConversation?.id);

				if (index !== -1) {
					store.conversations[index].notifications = 0;
				}
			}

			store.selectedConversation = selectedConversation;

			return { ...store };
		});
	},

	setConversationInitialState({ conversationsData, userId }) {
		chatState.update(store => {
			conversationsData.forEach(conversation => {
				store.conversations.push({
					id: conversation.conversation.id,
					createdAt: conversation.conversation.createdAt,
					groupDescription: conversation.conversation.groupDescription,
					groupName: conversation.conversation.groupName,
					isGroup: !!conversation.conversation.groupId,
					messages: conversation.lastMessages.toReversed(),
					notifications: conversation.unreadMessagesCount,
					participants: conversation.participants.filter(item => item.id !== userId),
					replyMessage: null,
					typeMessage: '',
					hasMessagesFetched: false,
				});
			});

			return { ...store };
		});
	},

	setConversationMessages({ conversationId, messages }) {
		chatState.update(store => {
			const index = store.conversations.findIndex(conversation => conversation.id === conversationId);

			if (index >= 0) {
				store.conversations[index].messages = messages;
				store.conversations[index].hasMessagesFetched = true;
				store.selectedConversation && (store.selectedConversation.messages = messages);
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

			return { ...store };
		});
	},

	updateConversationMessageStatus(params) {
		chatState.update(store => {
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

			return { ...store };
		});
	},
};
