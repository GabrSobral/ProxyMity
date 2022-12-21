import { Contact } from '../../../types/contact';

export type ContactReducerActions =
	| {
			type: 'ADD_CONTACT';
			payload: ContactDialog;
	  }
	| {
			type: 'SET_CONTACTS';
			payload: ContactDialog[];
	  }
	| {
			type: 'SELECT_CONTACT';
			payload: ContactDialog | null;
	  };

export interface ContactDialog extends Contact {
	lastMessage: {
		date: Date;
		content: string;
	} | null;
}

export interface ContactReducerState {
	contactsDialog: ContactDialog[];
	selectedContact: ContactDialog | null;
}

export const contactsInitialState: ContactReducerState = {
	contactsDialog: [],
	selectedContact: null,
};

export function ContactReducer(
	state: ContactReducerState,
	action: ContactReducerActions
): ContactReducerState {
	switch (action.type) {
		case 'SET_CONTACTS':
			return { ...state, contactsDialog: action.payload };

		case 'SELECT_CONTACT':
			return { ...state, selectedContact: action.payload };
		case 'ADD_CONTACT': {
			return {
				...state,
				contactsDialog: [action.payload, ...state.contactsDialog],
			};
		}
		default:
			return { ...state };
	}
}
