import { writable } from 'svelte/store';

import type { Actions, State } from './chat-store-types';
import { EMessageStatuses } from '../../../../../../enums/EMessageStatuses';

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
						if (message.read.length !== conversation.participants.length && message.author.id !== currentUserId) {
							message.read.push({ at: new Date(), userId: currentUserId });
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
							read: [],
							received: [],
							repliedMessage: message.repliedMessageId
								? {
										id: message.repliedMessageId,
										content: '',
									}
								: null,
							sent: [],
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

	setConversationMessages({ conversationId, messages }) {
		chatState.update(store => {
			const index = store.conversations.findIndex(conversation => conversation.id === conversationId);

			if (index >= 0) {
				store.conversations[index].messages = messages;
				store.conversations[index].hasMessagesFetched = true;
				store.selectedConversation && (store.selectedConversation.messages = messages);
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
						if (status === EMessageStatuses.READ && message.read.length !== numberOfParticipants) {
							store.conversations[conversationIndex].notifications = 0;
							message.read.push({ at: new Date(), userId });
						}

						if (status === EMessageStatuses.RECEIVED && message.id === params.messageId) {
							message.received.push({ at: new Date(), userId });
						}

						if (status === EMessageStatuses.SENT && message.id === params.messageId) {
							message.sent.push({ at: new Date(), userId });
						}

						return message;
					}
				);
			}

			return store;
		});
	},
};
