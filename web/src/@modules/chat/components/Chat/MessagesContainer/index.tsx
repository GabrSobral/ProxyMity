/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef } from 'react';

import { Message } from './Message';
import { TypeBar } from './TypeBar';

import { Heading } from '@/@design-system/Heading';

import { ScrollToBottomButton } from './ScrollToBottomButton';
import { useChatsStore } from '../../../contexts/chat-context/stores/chat';

export function MessagesContainer() {
	const isFirstAccess = useRef(true);
	const messageContainerRef = useRef<HTMLUListElement>(null);

	const { selectedConversation } = useChatsStore();
	const conversationMessages = selectedConversation?.messages;

	useEffect(() => {
		isFirstAccess.current = true;
	}, [selectedConversation]);

	useEffect(() => {
		const container = messageContainerRef.current;

		if (container && container.scrollHeight > container.clientHeight) {
			container.scrollTo({
				top: container.scrollHeight,
				behavior: isFirstAccess.current ? 'auto' : 'smooth',
			});

			isFirstAccess.current = false;
		}
	}, [conversationMessages]);

	return (
		<div className="overflow-hidden w-full flex-1 h-full flex flex-col p-1 relative">
			<ul className="flex flex-col gap-2 overflow-auto p-4" ref={messageContainerRef}>
				{conversationMessages?.length === 0 ? (
					<div className="flex-1 flex items-center justify-center flex-col gap-3 pointer-events-none">
						<img src="/no-messages.svg" alt="No message" className="w-[25rem]" />
						<Heading size="sm" className="opacity-80">
							No messages have been sent yet...
						</Heading>
					</div>
				) : (
					conversationMessages?.map((message, i) => (
						<Message key={message.id} message={message} previousMessage={conversationMessages?.[i - 1]} />
					))
				)}
			</ul>

			<ScrollToBottomButton messageContainerRef={messageContainerRef} />
			<TypeBar />
		</div>
	);
}
