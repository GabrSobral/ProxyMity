import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { PlusCircle } from 'react-feather';
import { generateAvatar } from '../../../../constants/avatar.config';

import { useChat } from '../../../../contexts/chat-context/hook';
import { APISearchContactByEmail } from '../../../../services/api/search-contact-by-email';
import { registerContactAsyncDB } from '../../../../services/database/use-cases/register-contact';
import { Contact } from '../../../../types/contact';

import { Button } from '../../../elements/Button';
import { Input } from '../../../elements/Input';
import { Modal } from '../../../elements/Modal';

interface Props {
	closeModal: () => void;
	show: boolean;
}

interface IMessage {
	type: 'success' | 'error';
	content: string;
}

export function NewContactModal({ closeModal, show }: Props) {
	const [newContactEmail, setNewContactEmail] = useState('');
	const [message, setMessage] = useState<IMessage | null>(null);
	const { contactsDispatch } = useChat();

	useEffect(() => setMessage(null), [show]);

	async function searchContact() {
		const { data } = await APISearchContactByEmail({ email: newContactEmail });

		if (data) {
			const contact: Contact = { ...data, avatarConfig: JSON.parse(data.avatarConfig as string) };
			registerContactAsyncDB(contact);

			contactsDispatch({
				type: 'ADD_CONTACT',
				payload: contact,
			});

			setMessage({ type: 'success', content: 'Nice! You added your friend.' });
			closeModal();
		} else {
			setMessage({ type: 'error', content: "Oops! We don't find any user with this e-mail." });
		}
	}

	return (
		<Modal closeModal={closeModal} show={show} className="w-[30rem]" showCloseButton>
			<Modal.Title>Add new contact</Modal.Title>
			<Modal.Description>Type the e-mail of you friend, to add him.</Modal.Description>

			<Input.Group>
				<Input.Label>E-mail</Input.Label>

				<Input.InputWrapper className="w-full">
					<Input
						placeholder="Type the e-mail"
						type="email"
						value={newContactEmail}
						onChange={e => setNewContactEmail(e.target.value)}
					/>
				</Input.InputWrapper>
			</Input.Group>

			{message && (
				<span
					className={clsx('flex text-center', {
						'text-green-500': message.type === 'success',
						'text-red-500': message.type === 'error',
					})}
				>
					{message.content}
				</span>
			)}

			<Button type="button" onClick={searchContact} className="w-full">
				<PlusCircle className="text-white" />
				Add
			</Button>
		</Modal>
	);
}