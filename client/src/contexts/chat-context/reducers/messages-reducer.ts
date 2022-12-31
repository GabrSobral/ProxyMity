import { Message } from '../../../types/message';

export type MessagesReducerActions =
	| {
			type: 'ADD_MESSAGE';
			payload: { contactId: string; message: Message };
	  }
	| {
			type: 'SET_CONTACT_MESSAGES';
			payload: { contactId: string; messages: Message[] };
	  };

export interface MessagesReducerState {
	contacts: {
		id: string;
		messages: Message[];
	}[];
}

export const messagesInitialState: MessagesReducerState = {
	contacts: [],
};

export function MessagesReducer(
	state: MessagesReducerState,
	action: MessagesReducerActions
): MessagesReducerState {
	switch (action.type) {
		case 'ADD_MESSAGE': {
			const { contactId, message } = action.payload;
			const index = state.contacts.findIndex(contact => contact.id === contactId);

			if (index >= 0) {
				state.contacts[index].messages.push(message);
			} else {
				state.contacts.push({ id: contactId, messages: [message] });
			}

			return { ...state };
		}

		case 'SET_CONTACT_MESSAGES': {
			const { contactId, messages } = action.payload;
			const index = state.contacts.findIndex(contact => contact.id === contactId);

			if (index >= 0) {
				const messagesNotLoaded = messages.filter(message => {
					return state.contacts[index].messages.includes(message);
				});

				state.contacts[index].messages = [...messagesNotLoaded, ...state.contacts[index].messages];
				// state.contacts[index].messages = messages;
			} else {
				state.contacts.push({ id: contactId, messages });
			}
			return { ...state };
		}

		default:
			return { ...state };
	}
}
