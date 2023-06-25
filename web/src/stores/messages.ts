import { create } from 'zustand';
import { Draft, Immutable, produce } from 'immer';

import { Message } from '@/types/message';

export type IMessage = Immutable<Message>;

interface IMessagesStore {
	state: {
		contacts: {
			id: string;
			messages: Message[];
			notifications: number;
			typeMessage: string;
			replyMessage: Message | null;
		}[];
	};
	actions: {
		addMessage(payload: { contactId: string; message: Message; shouldNotification?: boolean }): void;
		setContactMessages(payload: { contactId: string; messages: Message[]; notifications: number }): void;
		updateContactMessageStatus(
			payload:
				| {
						contactId: string;
						messageId: string;
						status: 'sent' | 'received';
				  }
				| { contactId: string; status: 'read' }
		): void;
		setContactInitialState(payload: { contactId: string; notificationCount: number; lastMessage: Message }): void;
		saveTypeMessageFromContact(payload: { contactId: string; typeMessage: string }): void;
		setReplyMessageFromContact(payload: { contactId: string; message: Message }): void;
		removeReplyMessageFromContact(payload: { contactId: string }): void;
	};
}

export const useMessageStore = create<IMessagesStore>(set => ({
	state: {
		contacts: [],
	},
	actions: {
		addMessage: ({ contactId, message, shouldNotification }) =>
			set(
				produce((store: Draft<IMessagesStore>) => {
					const index = store.state.contacts.findIndex(contact => contact.id === contactId);

					if (index >= 0) {
						store.state.contacts[index].messages.push(message);

						const currentNotifications = store.state.contacts[index].notifications;
						store.state.contacts[index].notifications = shouldNotification ? currentNotifications + 1 : 0;

						if (store.state.contacts[index].messages.length > 100) {
							store.state.contacts[index].messages.shift();
						}
					} else {
						store.state.contacts.push({
							id: contactId,
							messages: [message],
							notifications: 0,
							typeMessage: '',
							replyMessage: null,
						});
					}
				})
			),

		setContactMessages: ({ contactId, messages, notifications }) =>
			set(
				produce((store: Draft<IMessagesStore>) => {
					const index = store.state.contacts.findIndex(contact => contact.id === contactId);

					if (index >= 0) {
						store.state.contacts[index].messages = messages;
					} else {
						store.state.contacts.push({ id: contactId, messages, notifications, typeMessage: '', replyMessage: null });
					}
				})
			),

		updateContactMessageStatus: params =>
			set(
				produce((store: Draft<IMessagesStore>) => {
					const { contactId, status } = params;

					const contactIndex = store.state.contacts.findIndex(item => item.id === contactId);

					if (contactIndex > -1) {
						store.state.contacts[contactIndex].messages = store.state.contacts[contactIndex].messages.map(message => {
							if (status === 'read' && message.recipientId !== contactId) {
								store.state.contacts[contactIndex].notifications = 0;

								message.readAt = new Date();
								return message;
							}

							if (status === 'received' && message.id === params.messageId) {
								message.receivedAt = new Date();
							}

							if (status === 'sent' && message.id === params.messageId) {
								message.sentAt = new Date();
							}

							return message;
						});
					}
				})
			),

		setContactInitialState: ({ contactId, lastMessage, notificationCount }) =>
			set(
				produce((store: Draft<IMessagesStore>) => {
					const contactIndex = store.state.contacts.findIndex(item => item.id === contactId);

					if (contactIndex > -1) {
						store.state.contacts[contactIndex].messages = [...store.state.contacts[contactIndex].messages, lastMessage];
						store.state.contacts[contactIndex].notifications = notificationCount;
					} else {
						store.state.contacts.push({
							id: contactId,
							messages: [lastMessage],
							notifications: notificationCount,
							typeMessage: '',
							replyMessage: null,
						});
					}
				})
			),

		saveTypeMessageFromContact: ({ contactId, typeMessage }) =>
			set(
				produce((store: Draft<IMessagesStore>) => {
					const contactIndex = store.state.contacts.findIndex(item => item.id === contactId);

					if (contactIndex >= 0) {
						store.state.contacts[contactIndex].typeMessage = typeMessage;
					}
				})
			),

		setReplyMessageFromContact: ({ contactId, message }) =>
			set(
				produce((store: Draft<IMessagesStore>) => {
					const contactIndex = store.state.contacts.findIndex(item => item.id === contactId);

					if (contactIndex >= 0) {
						store.state.contacts[contactIndex].replyMessage = message;
					}
				})
			),

		removeReplyMessageFromContact: ({ contactId }) =>
			set(
				produce((store: Draft<IMessagesStore>) => {
					const contactIndex = store.state.contacts.findIndex(item => item.id === contactId);

					if (contactIndex >= 0) {
						store.state.contacts[contactIndex].replyMessage = null;
					}
				})
			),
	},
}));
