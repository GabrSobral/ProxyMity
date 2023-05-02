import { create } from 'zustand';
import { Draft, Immutable, produce } from 'immer';

import { Contact } from '@/types/contact';

type IContactStore = Immutable<{
	state: {
		contacts: Contact[];
		selectedContact: Contact | null;
		showContactDetail: boolean;
	};
	actions: {
		addContact(contact: Contact): void;
		setContacts(contacts: Contact[]): void;
		selectContact(contact: Contact | null): void;
		bringToTop(contactId: Contact['id']): void;
		handleShowContactDetail(): void;
	};
}>;

export const useContactStore = create<IContactStore>(set => ({
	state: {
		contacts: [],
		selectedContact: null,
		showContactDetail: false,
	},
	actions: {
		addContact: contact =>
			set(
				produce((store: Draft<IContactStore>) => {
					store.state.contacts = [contact, ...store.state.contacts];
				})
			),

		setContacts: contacts =>
			set(
				produce((store: Draft<IContactStore>) => {
					store.state.contacts = contacts;
				})
			),

		selectContact: contact =>
			set(
				produce((store: Draft<IContactStore>) => {
					store.state.selectedContact = contact;
				})
			),

		bringToTop: contactId =>
			set(
				produce((store: Draft<IContactStore>) => {
					if (store.state.contacts.length <= 1 || contactId === store.state.contacts[0]?.id) {
						return;
					}

					store.state.contacts = store.state.contacts.sort((first, second) =>
						first.id === contactId ? -1 : second.id === contactId ? 1 : 0
					);
				})
			),

		handleShowContactDetail: () =>
			set(
				produce((store: Draft<IContactStore>) => {
					store.state.showContactDetail = !store.state.showContactDetail;
				})
			),
	},
}));
