import { createContext, Dispatch, ReactNode, useCallback, useEffect, useReducer } from 'react';

import { getContactsAsyncDB } from '../../services/database/use-cases/get-contacts';
import { registerContactAsyncDB } from '../../services/database/use-cases/register-contact';

import { Contact } from '../../types/contact';

import {
	ContactDialog,
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

interface ChatContextProps {
	contactsState: ContactReducerState;
	contactsDispatch: Dispatch<ContactReducerActions>;

	messagesState: MessagesReducerState;
	messagesDispatch: Dispatch<MessagesReducerActions>;
}

export const ChatContext = createContext({} as ChatContextProps);

export function ChatProvider({ children }: { children: ReactNode }) {
	const [contactsState, contactsDispatch] = useReducer(ContactReducer, contactsInitialState);
	const [messagesState, messagesDispatch] = useReducer(MessagesReducer, messagesInitialState);

	const getContacts = useCallback(async () => {
		const raw = await getContactsAsyncDB();

		const contacts: ContactDialog[] = raw.map(item => ({
			id: item.id,
			name: item.name,
			email: item.email,
			lastMessage: null,
			lastOnline: item.lastOnline,
			registeredAt: item.registeredAt,
			createdAt: item.createdAt,
		}));

		contactsDispatch({ type: 'SET_CONTACTS', payload: contacts });
	}, []);

	const getMessagesFromContact = useCallback(() => {
		const messages = getMessagesFromContact();
	}, []);

	useEffect(() => {
		getContacts();
	}, [getContacts]);

	return (
		<ChatContext.Provider
			value={{
				contactsState,
				contactsDispatch,

				messagesState,
				messagesDispatch,
			}}
		>
			{children}
		</ChatContext.Provider>
	);
}
