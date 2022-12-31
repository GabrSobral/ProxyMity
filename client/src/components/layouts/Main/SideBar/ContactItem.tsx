import clsx from 'clsx';
import { useMemo } from 'react';
import { useChat } from '../../../../contexts/chat-context/hook';
import { Contact } from '../../../../types/contact';

interface Props {
	contactItem: Contact;
}

export function ContactItem({ contactItem }: Props) {
	const { contactsDispatch, contactsState, messagesState } = useChat();

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

	return (
		<li
			className={clsx(
				'w-full p-3 rounded-xl flex gap-4 cursor-pointer hover:opacity-90 transition-colors group bg-white dark:bg-gray-900',
				{
					'bg-red-500': isSelected,
				}
			)}
			onClick={() => contactsDispatch({ type: 'SELECT_CONTACT', payload: contactItem })}
		>
			<div
				className={clsx(
					'min-w-[3.5rem] min-h-[3.5rem] max-w-[3.5rem] max-h-[3.5rem] rounded-full bg-gray-900 brightness-75 transition-colors',
					{
						'ring-2 ring-green-500': true,
						'bg-red-600': isSelected,
					}
				)}
			></div>

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
					className="text-gray-400 truncate group-hover:text-gray-200"
					title={lastMessage?.content}
				>
					{lastMessage ? lastMessage.content : 'No messages was sent'}
				</span>
			</div>
		</li>
	);
}
