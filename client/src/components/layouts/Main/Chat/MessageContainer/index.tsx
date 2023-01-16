import { Fragment, RefObject, useEffect } from 'react';
import autoAnimate from '@formkit/auto-animate';

import { useChat } from '../../../../../contexts/chat-context/hook';
import { Message } from './Message';
import { Heading } from '../../../../elements/Heading';

interface Props {
	refContainer: RefObject<HTMLDivElement>;
}

export function MessageContainer({ refContainer }: Props) {
	const { contactsState, messagesState } = useChat();

	const contactsMessages = messagesState.contacts.find(
		item => item.id === contactsState.selectedContact?.id
	);

	// useEffect(() => {
	// 	refContainer.current && autoAnimate(refContainer.current, { duration: 150 });
	// }, [refContainer]);

	return (
		<Fragment>
			<section className="flex flex-1 flex-col gap-1 p-4 overflow-y-auto" ref={refContainer}>
				{contactsMessages?.messages.length === 0 ? (
					<div className="flex-1 flex items-center justify-center flex-col gap-3 pointer-events-none">
						<img src="./src/assets/no-messages.svg" alt="No message" className="w-[25rem]" />
						<Heading size="sm" className="opacity-80">
							No messages have been sent yet...
						</Heading>
					</div>
				) : (
					contactsMessages?.messages.map(message => <Message key={message.id} message={message} />)
				)}
			</section>
		</Fragment>
	);
}
