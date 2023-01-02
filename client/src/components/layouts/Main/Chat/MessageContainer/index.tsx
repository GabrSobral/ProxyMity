import { Fragment, useEffect, useRef } from 'react';

import { useChat } from '../../../../../contexts/chat-context/hook';
import { ScrollToBottomButton } from './ScrollToBottomButton';
import { Message } from './Message';

export function MessageContainer() {
	const { contactsState, messagesState } = useChat();
	const container = useRef<HTMLDivElement>(null);

	const contactsMessages = messagesState.contacts.find(
		item => item.id === contactsState.selectedContact?.id
	);

	return (
		<Fragment>
			<section className="flex flex-1 flex-col gap-1 p-4  overflow-y-auto" ref={container}>
				{contactsMessages?.messages.map(message => (
					<Message key={message.id} message={message} />
				))}
			</section>

			<ScrollToBottomButton messageContainerRef={container} />
		</Fragment>
	);
}
