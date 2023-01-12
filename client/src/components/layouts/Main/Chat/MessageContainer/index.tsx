import { Fragment, RefObject } from 'react';

import { useChat } from '../../../../../contexts/chat-context/hook';
import { Message } from './Message';

interface Props {
	refContainer: RefObject<HTMLDivElement>;
}

export function MessageContainer({ refContainer }: Props) {
	const { contactsState, messagesState } = useChat();

	const contactsMessages = messagesState.contacts.find(
		item => item.id === contactsState.selectedContact?.id
	);

	return (
		<Fragment>
			<section className="flex flex-1 flex-col gap-1 p-4  overflow-y-auto" ref={refContainer}>
				{contactsMessages?.messages.map(message => (
					<Message key={message.id} message={message} />
				))}
			</section>
		</Fragment>
	);
}
