import clsx from 'clsx';
import { motion } from 'framer-motion';
import { ForwardedRef, forwardRef, useEffect, useMemo, useState } from 'react';

import { UserImage } from '@/@design-system/UserImage';
import { Contact } from '@/types/contact';
import { useContactStore } from '@/stores/contacts';
import { useMessageStore } from '@/stores/messages';
import { useUserStore } from '@/stores/user';

interface Props {
	contact: Contact;
	index: number;
}

export const ContactItem = forwardRef(
	({ contact, index }: Props, ref: ForwardedRef<HTMLLIElement>) => {
		const [typing, setTyping] = useState(false);

		const { selectContact } = useContactStore(store => store.actions);
		const { selectedContact } = useContactStore(store => store.state);

		const useData = useUserStore(store => store.state);

		const { contacts } = useMessageStore(store => store.state);

		const formatLastMessageDate = Intl.DateTimeFormat('pt-br', {
			hour: 'numeric',
			minute: 'numeric',
		});

		const isSelectedContact = selectedContact === contact;

		const lastMessage = useMemo(() => {
			if (!contacts) return null;

			const index = contacts.findIndex(contact => contact.id === contact.id);

			if (index >= 0) {
				return contacts[index].messages[contacts[index].messages.length - 1];
			}
			return null;
		}, [contacts, contact.id]);

		const notificationsCount = useMemo(() => {
			const index = contacts.findIndex(contact => contact.id === contact.id);

			if (index >= 0) {
				return contacts[index].messages.filter(
					item => !item.readAt && item.authorId !== useData.data?.id
				).length;
			}
		}, [contacts, contact.id, useData.data?.id]);

		useEffect(() => {
			if (!contact.id) return;

			const eventHandler = (event: CustomEventInit<{ typing: boolean; authorId: string }>) => {
				const data = event.detail!;

				if (data.authorId === contact.id) {
					setTyping(data.typing);
				}
			};

			addEventListener('@ws.receive_typing', eventHandler);

			return () => {
				removeEventListener('@ws.receive_typing', eventHandler);
			};
		}, [contact.id]);

		return (
			<motion.li
				layout
				ref={ref}
				initial={{ x: -30, opacity: 0 }}
				animate={{ x: 0, opacity: 1 }}
				exit={{ x: -30, opacity: 0 }}
				transition={{ duration: 0.3, delay: index / 10 + 0.2 }}
				onClick={() => selectContact(contact)}
				className="w-full  relative py-2 px-3 rounded-xl flex gap-4 cursor-pointer hover:opacity-90 transition-colors group bg-gray-900 shadow"
			>
				<div
					className={clsx(
						'absolute h-full bg-gradient-to-r from-[#1C64CE] border-0 to-[#B809A6] transition-all rounded-xl left-0 top-0 z-0 duration-[0.3s]',
						{
							'w-full': isSelectedContact,
							'w-0': !isSelectedContact,
						}
					)}
				/>
				<UserImage src={contact.photoUrl || ''} alt="Alt Text" status={contact.status} />

				<div className={clsx('flex flex-col gap-1 overflow-hidden w-full z-10')}>
					<span
						className={clsx('truncate font-medium flex items-center justify-between gap-3', {
							'text-white': true,
							'text-gray-700': false,
						})}
					>
						{contact.name}
						<span className="text-[12px] text-gray-200 ml-auto ">
							{formatLastMessageDate.format(new Date())}
						</span>
					</span>

					<span className={clsx('truncate flex justify-between gap-4 text-gray-200 text-sm')}>
						{typing ? 'Typing...' : lastMessage ? lastMessage.content : 'Start a conversation...'}

						{notificationsCount && notificationsCount > 0 && (
							<div className="rounded-full bg-purple-500 w-6 h-6 flex items-center justify-center text-white text-[12px]">
								{notificationsCount}
							</div>
						)}
					</span>
				</div>
			</motion.li>
		);
	}
);
