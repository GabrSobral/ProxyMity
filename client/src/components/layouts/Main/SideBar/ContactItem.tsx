import clsx from 'clsx';
import { useEffect, useMemo, useState } from 'react';
import { User } from 'react-feather';

import { useChat } from '../../../../contexts/chat-context/hook';
import { getLastMessage } from '../../../../services/database/use-cases/get-last-messages';
import { Contact } from '../../../../types/contact';

interface Props {
	contactItem: Contact;
}

export function ContactItem({ contactItem }: Props) {
	const { contactsDispatch, contactsState, messagesState } = useChat();
	const [typing, setTyping] = useState(false);

	const formatLastMessageDate = Intl.DateTimeFormat('pt-br', {
		hour: 'numeric',
		minute: 'numeric',
	});

	const isSelected = contactItem.email === contactsState.selectedContact?.email;

	getLastMessage({ contactId: contactItem.id }).then(data => console.log(data));

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
				'w-full p-3 rounded-xl flex gap-4 cursor-pointer hover:opacity-90 transition-colors group bg-white dark:bg-gray-900 shadow',
				{
					'bg-gradient-to-r from-[#1C64CE] border-0 to-[#B809A6]': isSelected,
				}
			)}
			onClick={() => {
				if (contactItem !== contactsState.selectedContact)
					contactsDispatch({ type: 'SELECT_CONTACT', payload: contactItem });
			}}
		>
			<div
				className={clsx(
					'min-w-[3.5rem] min-h-[3.5rem] max-w-[3.5rem] max-h-[3.5rem] rounded-full transition-colors flex items-center justify-center shadow bg-gray-50',
					{
						'ring-2 ring-green-500': false,
					}
				)}
			>
				<User size={32} className="text-purple-500" />
			</div>

			<div className="flex flex-col gap-2 overflow-hidden">
				<span
					className={clsx('truncate font-medium flex items-center justify-between gap-3', {
						'text-white': contactItem === contactsState.selectedContact,
						'text-gray-700': contactItem !== contactsState.selectedContact,
					})}
				>
					{contactItem.name}

					{/* {lastMessage?.writtenAt && (
						<span className="text-[12px] text-gray-400">
							{formatLastMessageDate.format(lastMessage?.writtenAt)}
						</span>
					)} */}
				</span>

				<span
					className={clsx('truncate', {
						'text-gray-200': isSelected && !typing,
						'text-gray-400': !isSelected && !typing,
						'text-red-500 font-bold': !isSelected && typing,
						'text-white font-bold': isSelected && typing,
					})}
					title={lastMessage?.content}
				>
					{typing ? 'Typing...' : lastMessage ? lastMessage.content : 'No messages was sent'}
				</span>
			</div>
		</li>
	);
}
