import clsx from 'clsx';
import { useEffect, useMemo, useRef, useState } from 'react';
import { generateAvatar } from '../../../../constants/avatar.config';

import { useChat } from '../../../../contexts/chat-context/hook';
import { useUser } from '../../../../contexts/user-context/hook';
import { Contact } from '../../../../types/contact';
import { Avatar } from '../../../modules/Avatar';

interface Props {
	contactItem: Contact;
}

export function ContactItem({ contactItem }: Props) {
	const { contactsDispatch, contactsState, messagesState, selectContact } = useChat();
	const { userState } = useUser();
	const [typing, setTyping] = useState(false);

	const formatLastMessageDate = Intl.DateTimeFormat('pt-br', {
		hour: 'numeric',
		minute: 'numeric',
	});

	const isSelected = contactItem.email === contactsState.selectedContact?.email;

	const lastMessage = useMemo(() => {
		if (!messagesState?.contacts) return null;

		const index = messagesState.contacts.findIndex(contact => contact.id === contactItem.id);

		if (index >= 0) {
			return messagesState.contacts[index].messages[
				messagesState.contacts[index].messages.length - 1
			];
		}
		return null;
	}, [messagesState, contactItem.id]);

	const notificationsCount = useMemo(() => {
		const index = messagesState.contacts.findIndex(contact => contact.id === contactItem.id);

		if (index >= 0) {
			return messagesState.contacts[index].messages.filter(
				item => !item.readAt && item.authorId !== userState.data?.id
			).length;
		}
	}, [messagesState, contactItem.id, userState.data?.id]);

	useEffect(() => {
		if (!contactItem.id) return;

		const eventHandler = (event: CustomEventInit<{ typing: boolean; authorId: string }>) => {
			const data = event.detail!;

			if (data.authorId === contactItem.id) {
				setTyping(data.typing);
			}
		};

		addEventListener('@ws.receive_typing', eventHandler);

		return () => {
			removeEventListener('@ws.receive_typing', eventHandler);
		};
	}, [contactItem.id]);

	return (
		<li
			className={clsx(
				'w-full py-2 px-3 rounded-xl flex gap-4 cursor-pointer hover:opacity-90 transition-colors group bg-white dark:bg-gray-900 shadow',
				{
					'bg-gradient-to-r from-[#1C64CE] border-0 to-[#B809A6]': isSelected,
				}
			)}
			onClick={() => selectContact({ contact: contactItem })}
		>
			<div
				className={clsx('min-w-[4rem] min-h-[4rem] max-w-[4rem] max-h-[4rem]', {
					'ring-2 ring-green-500': false,
				})}
			>
				<Avatar userConfig={contactItem.avatarConfig} />
			</div>

			<div className="flex flex-col gap-1 overflow-hidden w-full">
				<span
					className={clsx('truncate font-medium flex items-center justify-between gap-3', {
						'text-white': contactItem === contactsState.selectedContact,
						'text-gray-700': contactItem !== contactsState.selectedContact,
					})}
				>
					{contactItem.name}

					{/* {lastMessage?.writtenAt && (
						<span className="text-[12px] text-gray-400 ml-auto ">
							{formatLastMessageDate.format(lastMessage?.writtenAt)}
						</span>
					)} */}
				</span>

				<span
					className={clsx('truncate flex justify-between gap-4', {
						'text-gray-200': isSelected && !typing,
						'text-gray-400': !isSelected && !typing,
						'text-red-500 font-bold': !isSelected && typing,
						'text-white font-bold': isSelected && typing,
					})}
					title={lastMessage?.content}
				>
					{typing ? 'Typing...' : lastMessage ? lastMessage.content : 'Start a conversation...'}

					{notificationsCount !== 0 && (
						<div className="rounded-full bg-purple-500 w-6 h-6 flex items-center justify-center text-white text-[12px]">
							{notificationsCount}
						</div>
					)}
				</span>
			</div>
		</li>
	);
}
