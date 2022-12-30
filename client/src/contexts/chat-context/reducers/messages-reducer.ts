import { Message } from '../../../types/message';

export type MessagesReducerActions = {
	type: 'ADD_MESSAGE';
	payload: { contactId: string; message: Message };
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

			const newState = state.contacts.map(contact => {
				if (contact.id === contactId) contact.messages.push(message);

				return contact;
			});

			return { contacts: newState };
		}

		default:
			return { ...state };
	}
}
