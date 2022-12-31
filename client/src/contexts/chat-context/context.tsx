import { createContext, Dispatch, ReactNode, useEffect, useReducer } from 'react';
import { addMessageAsyncDB } from '../../services/database/use-cases/add-message';

import { getContactMessagesAsyncDB } from '../../services/database/use-cases/get-contact-messages';
import { getContactsAsyncDB } from '../../services/database/use-cases/get-contacts';
import { Message } from '../../types/message';

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

	useEffect(() => {
		if (!contactsState.selectedContact) return;

		const contactId = contactsState.selectedContact.id;

		getContactMessagesAsyncDB(contactId).then(messages => {
			messagesDispatch({ type: 'SET_CONTACT_MESSAGES', payload: { contactId, messages } });
		});
	}, [contactsState.selectedContact]);

	useEffect(() => {
		getContactsAsyncDB().then(contacts => {
			contactsDispatch({ type: 'SET_CONTACTS', payload: contacts });
		});
	}, []);

	useEffect(() => {
		function handler(message: Message) {
			addMessageAsyncDB(message);

			messagesDispatch({
				type: 'ADD_MESSAGE',
				payload: { contactId: message.authorId, message },
			});
		}

		addEventListener('@ws.receive_message', e => handler(e.detail.message));

		return () => {
			removeEventListener('@ws.receive_message', e => handler(e.detail.messag));
		};
	}, []);

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
