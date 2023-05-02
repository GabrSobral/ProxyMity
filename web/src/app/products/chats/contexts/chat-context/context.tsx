'use client';

import { createContext, ReactNode, useCallback, useEffect } from 'react';

import { APISearchContactById } from '@/services/api/search-contact-by-id';
import { addMessageAsyncDB } from '@/services/database/use-cases/add-message';
import { getContactsAsyncDB } from '@/services/database/use-cases/get-contacts';
import { registerContactAsyncDB } from '@/services/database/use-cases/register-contact';
import { getContactMessagesAsyncDB } from '@/services/database/use-cases/get-contact-messages';
import { readContactMessages as readContactMessagesDB } from '@/services/database/use-cases/read-contact-messages';

import { toBinary } from '@/utils/binary-parser';

import { useWebSocket } from '../websocket-context/hook';

import { Message } from '@/types/message';
import { Contact } from '@/types/contact';

import { useUserStore } from '@/stores/user';
import { useContactStore } from '@/stores/contacts';
import { useMessageStore } from '@/stores/messages';

import { contactsMock } from './mock';

interface ChatContextProps {}

export const ChatContext = createContext({} as ChatContextProps);

export function ChatProvider({ children }: { children: ReactNode }) {
	const userData = useUserStore(store => store.state);
	const { socket } = useWebSocket();

	const { contacts, selectedContact } = useContactStore(store => store.state);
	const { setContacts, bringToTop, addContact } = useContactStore(store => store.actions);

	const { setContactMessages, addMessage, readContactMessages } = useMessageStore(
		store => store.actions
	);
	const { contacts: messageContacts } = useMessageStore(store => store.state);

	useEffect(() => {
		if (!selectedContact || !userData.data?.id) return;

		const contactId = selectedContact.id;

		getContactMessagesAsyncDB(userData.data?.id + contactId).then(messages => {
			setContactMessages({ contactId, messages });
		});
	}, [selectedContact, userData.data?.id, setContactMessages]);

	useEffect(() => {
		getContactsAsyncDB().then(contacts => {
			// setContacts(contacts);
			setContacts(contactsMock);
		});
	}, []);

	useEffect(() => {
		function handler(e: CustomEventInit<{ message: Message }>) {
			const message = e.detail?.message;

			if (!message) return;

			addMessageAsyncDB({
				...message,
				receivedAt: 'none',
				readAt: 'none',
				contactRef: message.recipientId + message.authorId,
			});

			addMessage({
				contactId: message.authorId,
				message: {
					...message,
					receivedAt: 'none',
					readAt: 'none',
					contactRef: message.recipientId + message.authorId,
				},
			});

			bringToTop(message.authorId);
		}

		addEventListener('@ws.receive_message', handler);
		return () => removeEventListener('@ws.receive_message', handler);
	}, []);

	useEffect(() => {
		function handler(event: CustomEventInit<{ contactId: string }>) {
			if (!userData.data?.id) return;

			const contactId = event.detail?.contactId || '';

			readContactMessages({ contactId });
		}

		addEventListener('@ws.receive_read_message', handler);
		return () => removeEventListener('@ws.receive_read_message', handler);
	}, [userData.data?.id]);

	useEffect(() => {
		const contactsNotRegistered = messageContacts.filter(mContact =>
			contacts.every(contact => contact.id !== mContact.id)
		);

		for (const contact of contactsNotRegistered) {
			APISearchContactById({ id: contact.id }).then(({ data }) => {
				registerContactAsyncDB(data);
				addContact(data);
			});
		}
	}, [messageContacts, contacts]);

	const selectContact = useCallback(
		async ({ contact }: { contact: Contact }) => {
			if (contact === selectedContact || !userData.data) return;

			selectContact({ contact });
			readContactMessages({ contactId: contact.id });
			readContactMessagesDB({ contactId: contact.id, userId: userData.data.id });

			socket.send(
				toBinary(
					JSON.stringify({
						event: 'send_read_message',
						payload: {
							contactId: userData.data.id,
							recipientId: contact.id,
						},
					})
				)
			);
		},
		[selectedContact, userData.data]
	);

	return <ChatContext.Provider value={{}}>{children}</ChatContext.Provider>;
}
