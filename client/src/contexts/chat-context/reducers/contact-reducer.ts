import { Contact } from '../../../types/contact';

export type ContactReducerActions =
	| {
			type: 'ADD_CONTACT';
			payload: Contact;
	  }
	| {
			type: 'SET_CONTACTS';
			payload: Contact[];
	  }
	| {
			type: 'SELECT_CONTACT';
			payload: Contact | null;
	  }
	| {
			type: 'BRING_TO_TOP';
			payload: { contactId: string };
	  };

export interface ContactReducerState {
	contactsDialog: Contact[];
	selectedContact: Contact | null;
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

		case 'BRING_TO_TOP': {
			const { contactId } = action.payload;

			if (state.contactsDialog.length <= 1 || contactId === state.contactsDialog[0]?.id)
				return state;

			return {
				...state,
				contactsDialog: state.contactsDialog.sort((first, second) =>
					first.id === contactId ? -1 : second.id === contactId ? 1 : 0
				),
			};
		}
		default:
			return { ...state };
	}
}
