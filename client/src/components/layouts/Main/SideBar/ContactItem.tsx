import clsx from 'clsx';
import { useChat } from '../../../../contexts/chat-context/hook';
import { ContactDialog } from '../../../../contexts/chat-context/reducers/contact-reducer';

interface Props {
	contactItem: ContactDialog;
}

export function ContactItem({ contactItem }: Props) {
	const { contactsDispatch, contactsState } = useChat();

	const formatLastMessageDate = Intl.DateTimeFormat('pt-br', {
		hour: 'numeric',
		minute: 'numeric',
	});

	const isSelected = contactItem.email === contactsState.selectedContact?.email;
	return (
		<li
			className={clsx(
				'w-full p-3 rounded-xl flex gap-4 cursor-pointer hover:opacity-90 transition-colors group bg-gray-900',
				{
					'bg-[#766AC8]': isSelected,
				}
			)}
			onClick={() =>
				contactsDispatch({ type: 'SELECT_CONTACT', payload: contactItem })
			}
		>
			<div
				className={clsx(
					'min-w-[3.5rem] min-h-[3.5rem] max-w-[3.5rem] max-h-[3.5rem] rounded-full bg-gray-900 brightness-75 transition-colors',
					{
						'ring-1 ring-green-500': contactItem.isOnline,
						'bg-[#766AC8]': isSelected,
					}
				)}
			></div>

			<div className="flex flex-col gap-2 overflow-hidden">
				<span className="text-gray-200 truncate font-medium flex items-center justify-between gap-3">
					{contactItem.name}

					{contactItem.lastMessage?.date && (
						<span className="text-[12px] text-gray-400">
							{formatLastMessageDate.format(contactItem.lastMessage?.date)}
						</span>
					)}
				</span>

				<span
					className="text-gray-400 truncate group-hover:text-gray-200"
					title={contactItem.lastMessage?.content}
				>
					{contactItem.lastMessage?.content}
				</span>
			</div>
		</li>
	);
}
