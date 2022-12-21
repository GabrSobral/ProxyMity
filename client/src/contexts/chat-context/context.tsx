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

interface ChatContextProps {
	contactsState: ContactReducerState;
	contactsDispatch: Dispatch<ContactReducerActions>;
}

export const ChatContext = createContext({} as ChatContextProps);

export function ChatProvider({ children }: { children: ReactNode }) {
	const [contactsState, contactsDispatch] = useReducer(ContactReducer, contactsInitialState);

	const registerContact = useCallback(async () => {
		const contact: Contact = {
			id: 'eita',
			name: 'Gabriel Sobral',
			email: 'Gabriel_Sobral@gmail.com',
			lastOnline: null,
			registeredAt: new Date(),
			createdAt: new Date(),
		};

		await registerContactAsyncDB(contact);

		contactsDispatch({
			type: 'ADD_CONTACT',
			payload: {
				id: contact.id,
				name: contact.name,
				email: contact.email,

				lastOnline: null,
				lastMessage: null,
				registeredAt: contact.registeredAt,
				createdAt: contact.createdAt,
			},
		});
	}, []);

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

	useEffect(() => {
		getContacts();
	}, []);

	return (
		<ChatContext.Provider
			value={{
				contactsState,
				contactsDispatch,
			}}
		>
			{children}
		</ChatContext.Provider>
	);
}
