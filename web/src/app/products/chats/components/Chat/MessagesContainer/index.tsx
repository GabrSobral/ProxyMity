import { useEffect, useRef } from 'react';

import { Message } from './Message';
import { TypeBar } from './TypeBar';

import { useMessageStore } from '@/stores/messages';
import { useContactStore } from '@/stores/contacts';

import { Heading } from '@/@design-system/Heading';

import { ScrollToBottomButton } from './ScrollToBottomButton';

export function MessagesContainer() {
	const isFirstAccess = useRef(true);
	const messageContainerRef = useRef<HTMLUListElement>(null);

	const contactsMessages = useMessageStore(store => store.state.contacts);
	const selectedContact = useContactStore(store => store.state.selectedContact);

	const contactMessages = contactsMessages.find(item => item.id === selectedContact?.id);

	useEffect(() => {
		isFirstAccess.current = true;
	}, [selectedContact]);

	useEffect(() => {
		const container = messageContainerRef.current;

		if (container && container.scrollHeight > container.clientHeight) {
			container.scrollTo({
				top: container.scrollHeight,
				behavior: isFirstAccess.current ? 'auto' : 'smooth',
			});

			isFirstAccess.current = false;
		}
	}, [contactMessages]);

	return (
		<div className="overflow-hidden w-full flex-1 h-full flex flex-col p-1 relative">
			<ul className="flex flex-col gap-2 overflow-auto p-4" ref={messageContainerRef}>
				{contactMessages?.messages.length === 0 ? (
					<div className="flex-1 flex items-center justify-center flex-col gap-3 pointer-events-none">
						<img src="/no-messages.svg" alt="No message" className="w-[25rem]" />
						<Heading size="sm" className="opacity-80">
							No messages have been sent yet...
						</Heading>
					</div>
				) : (
					contactMessages?.messages.map((message, i) => (
						<Message
							key={message.id}
							message={message}
							previousIsFromUser={contactMessages?.messages[i - 1]?.authorId === message.authorId}
						/>
					))
				)}
			</ul>

			<ScrollToBottomButton messageContainerRef={messageContainerRef} />
			<TypeBar />
		</div>
	);
}
