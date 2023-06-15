'use client';

import { useContactStore } from '@/stores/contacts';

import { ContactItem } from './ContactItem';
import { AnimatePresence } from 'framer-motion';
import { useMessageStore } from '@/stores/messages';

export function MessagesList() {
	const contacts = useContactStore(store => store.state.contacts);
	const contactsMessages = useMessageStore(store => store.state.contacts);

	const allNotificationsCount = contactsMessages.reduce((sum, item) => sum + item.notifications, 0);

	return (
		<section className="flex flex-col bg-gray-900 rounded-[10px] p-3 relative overflow-hidden flex-1">
			<h2 className="text-lg font-semibold text-white tracking-wide flex gap-3 items-center">
				Messages
				{allNotificationsCount > 0 && (
					<span className="bg-purple-500 text-white rounded-full p-1 text-[0.6rem] flex items-center justify-center max-w-[1.25rem] max-h-[1.25rem] min-w-[1.25rem] min-h-[1.25rem]">
						{allNotificationsCount}
					</span>
				)}
			</h2>

			<ul className="flex flex-col gap-2 mt-4 overflow-auto rounded-[10px]">
				<AnimatePresence mode="popLayout">
					{contacts.map((contact, index) => (
						<ContactItem key={contact.id} contact={contact} index={index} />
					))}
				</AnimatePresence>
			</ul>

			<div className="absolute bottom-0 h-16 w-full z-10 bg-gradient-to-t from-gray-900 pointer-events-none" />
		</section>
	);
}
