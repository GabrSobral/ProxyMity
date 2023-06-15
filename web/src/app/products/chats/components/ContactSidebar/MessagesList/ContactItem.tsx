import clsx from 'clsx';
import { motion } from 'framer-motion';
import { PulseLoader } from 'react-spinners';
import tailwindColors from 'tailwindcss/colors';
import { ForwardedRef, forwardRef, useEffect, useMemo, useState } from 'react';

import { UserImage } from '@/@design-system/UserImage';
import { Contact } from '@/types/contact';

import { useUserStore } from '@/stores/user';
import { useContactStore } from '@/stores/contacts';
import { useMessageStore } from '@/stores/messages';

import { useChat } from '../../../contexts/chat-context/hook';

interface Props {
	contact: Contact;
	index: number;
}

export const ContactItem = forwardRef(({ contact, index }: Props, ref: ForwardedRef<HTMLLIElement>) => {
	const formatLastMessageDate = Intl.DateTimeFormat('pt-br', { hour: 'numeric', minute: 'numeric' });

	const [typing, setTyping] = useState(false);
	const { selectContactAsync } = useChat();

	const userData = useUserStore(store => store.state);
	const { selectedContact } = useContactStore(store => store.state);
	const { contacts: contactsMessages } = useMessageStore(store => store.state);

	const isSelectedContact = selectedContact === contact;

	const { lastMessage, notificationsCount } = useMemo(() => {
		const contactMessages = contactsMessages.find(contactMessages => contactMessages.id === contact.id);

		return {
			lastMessage: contactMessages ? contactsMessages[index]?.messages.at(-1) : null,
			notificationsCount: contactMessages?.notifications || 0,
		};
	}, [contactsMessages, index, contact.id]);

	useEffect(() => {
		if (!contact.id) {
			return;
		}

		const eventHandler = (event: CustomEventInit<{ typing: boolean; authorId: string }>) => {
			const data = event.detail!;

			if (data.authorId === contact.id) {
				setTyping(data.typing);
			}
		};

		addEventListener('@ws.receive_typing', eventHandler);
		return () => removeEventListener('@ws.receive_typing', eventHandler);
	}, [contact.id]);

	return (
		<motion.li
			layout
			ref={ref}
			initial={{ x: -30, opacity: 0 }}
			animate={{ x: 0, opacity: 1 }}
			exit={{ x: -30, opacity: 0 }}
			transition={{ duration: 0.3, delay: index / 10 + 0.2 }}
			onClick={() => selectContactAsync({ contact })}
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
					{contact.name} {contact.id === userData.data?.id && '(You)'}
					<span className="text-[12px] text-gray-200 ml-auto ">{formatLastMessageDate.format(new Date())}</span>
				</span>

				<div
					className={clsx('truncate flex justify-between gap-4 text-gray-200 text-sm', {
						'text-purple-500': typing && !isSelectedContact,
						'text-white': isSelectedContact,
					})}
				>
					{typing ? (
						<div className="">
							<PulseLoader
								color={isSelectedContact ? '#FFFFFF' : tailwindColors.purple['500']}
								size={8}
								title="Typing..."
							/>
						</div>
					) : lastMessage ? (
						lastMessage.content
					) : (
						<span>Start a conversation...</span>
					)}

					{notificationsCount > 0 && (
						<span className="rounded-full bg-purple-500 w-5 h-5 ml-auto flex items-center justify-center text-[12px] text-white font-medium animate-pulse z-10">
							{notificationsCount}
						</span>
					)}
				</div>
			</div>
		</motion.li>
	);
});
ContactItem.displayName = 'ContactItem';
