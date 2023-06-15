'use client';

import { createContext, ReactNode, RefObject, useCallback, useEffect, useRef } from 'react';

import { APISearchContactById } from '@/services/api/search-contact-by-id';

import { addMessageAsyncDB } from '@/services/database/use-cases/add-message';
import { getContactsAsyncDB } from '@/services/database/use-cases/get-contacts';
import { getLastMessageAsyncDB } from '@/services/database/use-cases/get-last-messages';
import { registerContactAsyncDB } from '@/services/database/use-cases/register-contact';
import { getContactMessagesAsyncDB } from '@/services/database/use-cases/get-contact-messages';
import { readContactMessagesAsyncDB } from '@/services/database/use-cases/read-contact-messages';
import { getContactNotificationCountAsyncDB } from '@/services/database/use-cases/get-contact-notification-count';

import { useWebSocket } from '../websocket-context/hook';
import { Events, ExtractPayloadType } from '../websocket-context/handler';
import { sendReadMessageWebSocketEvent } from '../websocket-context/emmiters/sendReadMessage';
import { sendReceiveMessageWebSocketEvent } from '../websocket-context/emmiters/sendReceiveMessage';

import { Message } from '@/types/message';
import { Contact } from '@/types/contact';

import { useUserStore } from '@/stores/user';
import { useContactStore } from '@/stores/contacts';
import { useMessageStore } from '@/stores/messages';

import { contactsMock } from './mock';

interface ChatContextProps {
	selectContactAsync: (params: { contact: Contact }) => Promise<void>;
	typebarRef: RefObject<HTMLInputElement>;
}

export const ChatContext = createContext({} as ChatContextProps);

export function ChatProvider({ children }: { children: ReactNode }) {
	const typebarRef = useRef<HTMLInputElement>(null);
	const userData = useUserStore(store => store.state.data);
	const { socket } = useWebSocket();

	const { contacts, selectedContact } = useContactStore(store => store.state);
	const { setContacts, bringToTop, addContact, selectContact } = useContactStore(store => store.actions);
	const {
		setContactMessages,
		addMessage,
		setContactInitialState,
		updateContactMessageStatus,
		saveTypeMessageFromContact,
	} = useMessageStore(store => store.actions);

	const { contacts: messageContacts } = useMessageStore(store => store.state);

	//🟡 Fetch contacts from IndexedDb, and set to React State
	//🟡 Fetch last messages from each contact, from IndexedDb, and set to React State
	useEffect(() => {
		if (!userData?.id) return;

		console.log('Downloading last message and notification count...');

		getContactsAsyncDB().then(() => {
			setContacts(contactsMock); // update it after

			contactsMock.forEach(async contact => {
				const contactRef = userData?.id + contact.id;

				const [lastMessage, notificationCount] = await Promise.all([
					getLastMessageAsyncDB({ contactRef }),
					getContactNotificationCountAsyncDB({ contactRef, userId: userData?.id || '' }),
				]);

				if (lastMessage) {
					setContactInitialState({ contactId: contact.id, lastMessage, notificationCount });
				}
			});
		});
	}, [userData?.id, setContactInitialState, setContacts]);

	//🟡 Receive a message from another user, and store it at state and IndexedDB
	useEffect(() => {
		function handler(e: CustomEventInit<ExtractPayloadType<'receive_message', Events>>) {
			const message = e.detail?.message;

			if (!message || !userData) return;

			sendReceiveMessageWebSocketEvent(socket, {
				contactId: userData.id,
				recipientId: message.authorId,
				messageId: message.id,
			});

			if (selectedContact?.id === message.authorId) {
				sendReadMessageWebSocketEvent(socket, {
					contactId: userData.id,
					recipientId: selectedContact.id,
				});
			}

			const payload: Message = {
				...message,
				receivedAt: new Date(),
				readAt: selectedContact?.id === message.authorId ? new Date() : 'none',
				contactRef: message.recipientId + message.authorId,
			};

			const shouldNotification = selectedContact?.id !== message.authorId;

			addMessageAsyncDB(payload);
			addMessage({ contactId: message.authorId, message: payload, shouldNotification });
			bringToTop(message.authorId);
		}

		addEventListener('@ws.receive_message', handler);
		return () => removeEventListener('@ws.receive_message', handler);
	}, [selectedContact?.id, socket, userData, addMessage, bringToTop]);

	useEffect(() => {
		console.log(messageContacts);
	}, [messageContacts]);

	//🟡 Receive the "read" message status from another user, and update it at state and IndexedDB
	useEffect(() => {
		function handler(event: CustomEventInit<ExtractPayloadType<'receive_read_message', Events>>) {
			if (!userData?.id) return;

			const contactId = event.detail?.contactId || '';

			updateContactMessageStatus({ contactId, status: 'read' });
			readContactMessagesAsyncDB({ contactId: contactId, userId: userData.id, itsMe: false });
		}

		addEventListener('@ws.receive_read_message', handler);
		return () => removeEventListener('@ws.receive_read_message', handler);
	}, [userData?.id, updateContactMessageStatus]);

	//🟡 Verify if exist some contact in Messages Status that don't exist inside Contact State, and create if not exist
	useEffect(() => {
		for (const mContact of messageContacts) {
			if (contacts.some(contact => contact.id === mContact.id)) return;

			APISearchContactById({ id: mContact.id }).then(({ data }) => {
				registerContactAsyncDB(data);
				addContact(data);
			});
		}
	}, [messageContacts, contacts, addContact]);

	//🟡 Receive a message that has the status changed, and update it on react state and IndexedDB
	useEffect(() => {
		function handler(event: CustomEventInit<ExtractPayloadType<'receive_message_status', Events>>) {
			if (!event.detail) {
				return;
			}

			const { messageId } = event.detail;
			const messageStatusEvent = new CustomEvent(messageId, { detail: event.detail });

			dispatchEvent(messageStatusEvent);
		}

		addEventListener('@ws.receive_message_status', handler);
		return () => removeEventListener('@ws.receive_message_status', handler);
	}, [updateContactMessageStatus]);

	const selectContactAsync = useCallback(
		async ({ contact }: { contact: Contact }) => {
			if (contact === selectedContact || !userData) return;

			saveTypeMessageFromContact({
				contactId: selectedContact?.id || '',
				typeMessage: typebarRef.current?.value || '',
			});

			selectContact(contact);
			getContactMessagesAsyncDB(userData?.id + contact.id).then(({ messages, notifications }) => {
				setContactMessages({ contactId: contact.id, messages, notifications });
			});

			updateContactMessageStatus({ contactId: contact.id, status: 'read' });
			readContactMessagesAsyncDB({
				contactId: contact.id,
				userId: userData.id,
				itsMe: true,
			});

			if (messageContacts.reduce((sum, item) => sum + item.notifications, 0) > 0)
				sendReadMessageWebSocketEvent(socket, {
					contactId: userData.id,
					recipientId: contact.id,
				});
		},
		[
			selectedContact,
			userData,
			saveTypeMessageFromContact,
			selectContact,
			updateContactMessageStatus,
			messageContacts,
			socket,
			setContactMessages,
		]
	);

	return (
		<ChatContext.Provider
			value={{
				selectContactAsync,
				typebarRef,
			}}
		>
			{children}
		</ChatContext.Provider>
	);
}
