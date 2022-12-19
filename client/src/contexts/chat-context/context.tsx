import {
	createContext,
	Dispatch,
	ReactNode,
	useEffect,
	useReducer,
} from 'react';
import { contactsMock } from '../../mocks/contacts';
import {
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
	const [contactsState, contactsDispatch] = useReducer(
		ContactReducer,
		contactsInitialState
	);

	useEffect(() => {
		contactsDispatch({ type: 'SET_CONTACTS', payload: contactsMock });
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
