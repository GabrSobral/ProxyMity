import { useState } from 'react';
import { Plus, Search } from 'react-feather';

import { useChat } from '../../../../contexts/chat-context/hook';
import { useUser } from '../../../../contexts/user-context/hook';

import { Button } from '../../../elements/Button';
import { Input } from '../../../elements/Input';
import { ContactItem } from './ContactItem';
import { Header } from './Header';

import { NewContactModal } from './NewContactModal';

export function SideBar() {
	const { contactsState } = useChat();
	const [searchContact, setSearchContact] = useState('');

	const [isNewContactModalVisible, setIsNewContactModalVisible] = useState(false);

	return (
		<aside className="h-screen w-[25rem] bg-white dark:bg-gray-900 max-h-screen flex flex-col relative">
			<div className="w-full px-4 py-2 sticky top-0 flex flex-col gap-2">
				<Header />

				<Input.Group>
					<Input.Label className="sr-only">Search contact</Input.Label>

					<Input.InputWrapper className="w-full">
						<Input
							placeholder="Search contact...."
							type="search"
							value={searchContact}
							onChange={e => setSearchContact(e.target.value)}
						/>

						<Search
							size={20}
							className="absolute pointer-events-none right-4 top-2/4 translate-y-[-50%] text-gray-400"
						/>
					</Input.InputWrapper>
				</Input.Group>
			</div>

			<ul className="flex flex-col gap-1 p-3 overflow-y-auto flex-1">
				{contactsState.contactsDialog.map(item => (
					<ContactItem key={item.email} contactItem={item} />
				))}
			</ul>

			<Button
				type="button"
				onClick={() => setIsNewContactModalVisible(true)}
				className="absolute rounded-full min-w-[3.5rem] min-h-[3.5rem] max-w-[3.5rem] max-h-[3.5rem] mt-auto bottom-6 right-6 p-2"
			>
				<Plus className="text-white" />
			</Button>

			<NewContactModal
				closeModal={() => setIsNewContactModalVisible(false)}
				show={isNewContactModalVisible}
			/>
		</aside>
	);
}
