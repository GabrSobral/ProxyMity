import { create } from 'zustand';
import { Draft, Immutable, produce } from 'immer';

import { Contact } from '@/types/contact';

export type Message = Immutable<{
	dbId?: number;

	id: string;
	content: string;

	contactRef?: string;

	recipientId: Contact['id'];
	authorId: Contact['id'];

	writtenAt: Date;
	sentAt: Date | 'none';
	receivedAt: Date | 'none';
	readAt: Date | 'none';
}>;

interface IMessagesStore {
	state: {
		contacts: {
			id: string;
			messages: Message[];
		}[];
	};
	actions: {
		addMessage(payload: { contactId: string; message: Message }): void;
		setContactMessages(payload: { contactId: string; messages: Message[] }): void;
		readContactMessages(payload: { contactId: string }): void;
	};
}

export const useMessageStore = create<IMessagesStore>(set => ({
	state: {
		contacts: [],
	},
	actions: {
		addMessage: ({ contactId, message }) =>
			set(
				produce((store: Draft<IMessagesStore>) => {
					const index = store.state.contacts.findIndex(contact => contact.id === contactId);

					if (index >= 0) {
						store.state.contacts[index].messages.push(message);

						if (store.state.contacts[index].messages.length > 100) {
							store.state.contacts[index].messages.shift();
						}
					} else {
						store.state.contacts.push({ id: contactId, messages: [message] });
					}
				})
			),

		setContactMessages: ({ contactId, messages }) =>
			set(
				produce((store: Draft<IMessagesStore>) => {
					const index = store.state.contacts.findIndex(contact => contact.id === contactId);

					if (index >= 0) {
						// const messagesNotLoaded = messages.filter(message => {
						// 	return store.state.contacts[index].messages.some(item => item.id === message.id);
						// });

						// store.state.contacts[index].messages = [...messagesNotLoaded, ...store.state.contacts[index].messages];
						store.state.contacts[index].messages = messages;
					} else {
						store.state.contacts.push({ id: contactId, messages });
					}
				})
			),

		readContactMessages: ({ contactId }) =>
			set(
				produce((store: Draft<IMessagesStore>) => {
					const contactIndex = store.state.contacts.findIndex(item => item.id === contactId);

					if (contactIndex > -1) {
						store.state.contacts[contactIndex].messages.forEach(message => {
							if (message && message.readAt === 'none') {
								message.readAt = new Date();
							}
						});
					}
				})
			),
	},
}));
