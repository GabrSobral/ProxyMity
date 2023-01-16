import { createContext, Dispatch, ReactNode, useCallback, useEffect, useReducer } from 'react';

import { APISearchContactById } from '../../services/api/search-contact-by-id';

import { addMessageAsyncDB } from '../../services/database/use-cases/add-message';
import { getContactsAsyncDB } from '../../services/database/use-cases/get-contacts';
import { registerContactAsyncDB } from '../../services/database/use-cases/register-contact';
import { getContactMessagesAsyncDB } from '../../services/database/use-cases/get-contact-messages';

import { Message } from '../../types/message';
import { useUser } from '../user-context/hook';

import {
	ContactReducer,
	ContactReducerActions,
	ContactReducerState,
	contactsInitialState,
} from './reducers/contact-reducer';
import {
	messagesInitialState,
	MessagesReducer,
	MessagesReducerActions,
	MessagesReducerState,
} from './reducers/messages-reducer';
import { Contact } from '../../types/contact';
import { readContactMessages } from '../../services/database/use-cases/read-contact-messages';
import { useWebSocket } from '../websocket-context/hook';
import { toBinary } from '../../utils/binary-parser';

interface ChatContextProps {
	contactsState: ContactReducerState;
	contactsDispatch: Dispatch<ContactReducerActions>;

	messagesState: MessagesReducerState;
	messagesDispatch: Dispatch<MessagesReducerActions>;

	selectContact: ({ contact }: { contact: Contact }) => Promise<void>;
}

export const ChatContext = createContext({} as ChatContextProps);

export function ChatProvider({ children }: { children: ReactNode }) {
	const { userState } = useUser();
	const { socket } = useWebSocket();
	const [contactsState, contactsDispatch] = useReducer(ContactReducer, contactsInitialState);
	const [messagesState, messagesDispatch] = useReducer(MessagesReducer, messagesInitialState);

	useEffect(() => {
		if (!contactsState.selectedContact || !userState.data?.id) return;

		const contactId = contactsState.selectedContact.id;

		getContactMessagesAsyncDB(userState.data?.id + contactId).then(messages => {
			messagesDispatch({ type: 'SET_CONTACT_MESSAGES', payload: { contactId, messages } });
		});
	}, [contactsState.selectedContact, userState.data?.id]);

	useEffect(() => {
		getContactsAsyncDB().then(contacts => {
			contactsDispatch({ type: 'SET_CONTACTS', payload: contacts });
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

			messagesDispatch({
				type: 'ADD_MESSAGE',
				payload: {
					contactId: message.authorId,
					message: {
						...message,
						receivedAt: 'none',
						readAt: 'none',
						contactRef: message.recipientId + message.authorId,
					},
				},
			});

			contactsDispatch({ type: 'BRING_TO_TOP', payload: { contactId: message.authorId } });
		}

		addEventListener('@ws.receive_message', handler);
		return () => removeEventListener('@ws.receive_message', handler);
	}, []);

	useEffect(() => {
		function handler(event: CustomEventInit<{ contactId: string }>) {
			if (!userState.data?.id) return;

			const contactId = event.detail?.contactId || '';

			readContactMessages({ contactId, userId: userState.data?.id });
			messagesDispatch({ type: 'READ_MESSAGES', payload: { contactId } });
		}

		addEventListener('@ws.receive_read_message', handler);
		return () => removeEventListener('@ws.receive_read_message', handler);
	}, [userState.data?.id]);

	useEffect(() => {
		const contactsNotRegistered = messagesState.contacts.filter(mContact =>
			contactsState.contactsDialog.every(contact => contact.id !== mContact.id)
		);

		for (const contact of contactsNotRegistered) {
			APISearchContactById({ id: contact.id }).then(({ data }) => {
				const contact = { ...data, avatarConfig: JSON.parse(data.avatarConfig as string) };

				registerContactAsyncDB(contact);
				contactsDispatch({
					type: 'ADD_CONTACT',
					payload: contact,
				});
			});
		}
	}, [messagesState, contactsState.contactsDialog]);

	const selectContact = useCallback(
		async ({ contact }: { contact: Contact }) => {
			if (contact === contactsState.selectedContact || !userState.data) return;

			contactsDispatch({ type: 'SELECT_CONTACT', payload: contact });
			readContactMessages({
				contactId: contact.id,
				userId: userState.data?.id,
			});

			socket.send(
				toBinary(
					JSON.stringify({
						event: 'send_read_message',
						payload: {
							contactId: userState.data.id,
							recipientId: contact.id,
						},
					})
				)
			);
		},
		[contactsState.selectedContact, userState.data]
	);

	return (
		<ChatContext.Provider
			value={{
				contactsState,
				contactsDispatch,

				messagesState,
				messagesDispatch,

				selectContact,
			}}
		>
			{children}
		</ChatContext.Provider>
	);
}
