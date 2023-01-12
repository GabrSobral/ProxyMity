import { User } from 'react-feather';
import { useChat } from '../../../../contexts/chat-context/hook';

export function ChatHeader() {
	const { contactsState } = useChat();

	return (
		<header className="w-full px-4 py-2 h-[4rem] bg-white dark:bg-gray-900 flex gap-4">
			<div className="min-w-[3rem] min-h-[3rem] max-w-[3rem] max-h-[3rem] rounded-full bg-gray-50 transition-colors flex items-center justify-center shadow">
				<User size={24} className="text-purple-500" />
			</div>

			<div>
				<span className="text-gray-700 dark:text-white-200 truncate text-md font-medium flex items-center justify-between gap-3">
					{contactsState.selectedContact?.name}
				</span>

				<span className="text-gray-400 truncate group-hover:text-gray-200">
					Last seen yesterday at 16h23
				</span>
			</div>
		</header>
	);
}
