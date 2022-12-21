import { Plus, Search } from 'react-feather';

import { useChat } from '../../../../contexts/chat-context/hook';
import { ContactItem } from './ContactItem';

export function SideBar() {
	const { contactsState } = useChat();

	return (
		<aside className="h-screen w-[25rem] bg-slate-900 max-h-screen flex flex-col relative">
			<div className="w-full px-4 py-2 h-[4rem] sticky top-0">
				<div className="relative">
					<Search
						size={20}
						className="absolute pointer-events-none right-4 top-2/4 translate-y-[-50%] text-gray-400"
					/>
					<input
						type="search"
						placeholder="Search...."
						className="px-4 py-3 rounded-lg bg-gray-800 focus:ring-2 focus:ring-purple-500 outline-none text-white text-sm w-full"
					/>
				</div>
			</div>

			<ul className="flex flex-col gap-1 p-3 overflow-y-auto flex-1">
				{contactsState.contactsDialog.map(item => (
					<ContactItem
						key={item.email}
						contactItem={item}
					/>
				))}
			</ul>

			<button
				type="button"
				onClick={() => {}}
				className="absolute rounded-full flex items-center justify-center bg-blue-500 min-w-[3.5rem] min-h-[3.5rem] max-w-[3.5rem] max-h-[3.5rem] mt-auto bottom-6 right-6"
			>
				<Plus className="text-white" />
			</button>
		</aside>
	);
}
