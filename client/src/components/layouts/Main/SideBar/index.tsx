import { Plus, Search } from 'react-feather';
import autoAnimate from '@formkit/auto-animate';
import { useEffect, useRef, useState } from 'react';

import { useChat } from '../../../../contexts/chat-context/hook';

import { Button } from '../../../elements/Button';
import { Input } from '../../../elements/Input';
import { ContactItem } from './ContactItem';
import { Header } from './Header';

import { NewContactModal } from './NewContactModal';
import { Heading } from '../../../elements/Heading';

export function SideBar() {
	const { contactsState } = useChat();
	const [searchContact, setSearchContact] = useState('');
	const contactContainerRef = useRef(null);

	const [isNewContactModalVisible, setIsNewContactModalVisible] = useState(false);

	useEffect(() => {
		contactContainerRef.current && autoAnimate(contactContainerRef.current, { duration: 200 });
	}, [contactContainerRef]);

	return (
		<aside className="h-screen w-[30rem] bg-white dark:bg-gray-900 max-h-screen flex flex-col relative">
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

			{contactsState.contactsDialog.length === 0 ? (
				<div className="flex-1 flex items-center justify-center flex-col gap-3 pointer-events-none">
					<img src="./src/assets/no-contacts.svg" alt="No message" className="w-[20rem]" />
					<Heading size="sm" className="opacity-60">
						No contacts have been added yet...
					</Heading>
				</div>
			) : (
				<ul className="flex flex-col gap-1 p-3 overflow-y-auto flex-1" ref={contactContainerRef}>
					{contactsState.contactsDialog.map(item => (
						<ContactItem key={item.email} contactItem={item} />
					))}
				</ul>
			)}

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
