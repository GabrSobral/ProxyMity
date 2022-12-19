export type ContactReducerActions =
	| {
			type: 'ADD_CONTACT';
			payload: ContactDialog;
	  }
	| {
			type: 'SET_CONTACTS';
			payload: ContactDialog[];
	  };

export interface ContactDialog {
	name: string;
	email: string;
	lastMessage: {
		date: Date;
		content: string;
	} | null;
	isOnline: boolean;
}

export interface ContactReducerState {
	contactsDialog: ContactDialog[];
}

export const contactsInitialState: ContactReducerState = {
	contactsDialog: [],
};

export function ContactReducer(
	state: ContactReducerState,
	action: ContactReducerActions
) {
	switch (action.type) {
		case 'SET_CONTACTS':
			return { ...state, contactsDialog: action.payload };
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
