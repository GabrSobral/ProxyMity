'use client';

import { v4 as uuidv4 } from 'uuid';
import { PaperPlaneTilt } from '@phosphor-icons/react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { Input } from '@/@design-system/Input';
import { Button } from '@/@design-system/Button';

import { useUserStore } from '@/stores/user';
import { useContactStore } from '@/stores/contacts';
import { useMessageStore } from '@/stores/messages';

import { useWebSocket } from '@/app/products/chats/contexts/websocket-context/hook';

import { Message } from '@/types/message';

import { addMessageAsyncDB } from '@/services/database/use-cases/add-message';

import { toBinary } from '@/utils/binary-parser';

export function TypeBar() {
	const textAreaRef = useRef<HTMLInputElement>(null);
	const userData = useUserStore(store => store.state);

	const { addMessage } = useMessageStore(store => store.actions);

	const selectedContact = useContactStore(store => store.state.selectedContact);
	const { bringToTop } = useContactStore(store => store.actions);

	const [type, setType] = useState('');

	const { socket } = useWebSocket();

	const sendMessage = useCallback(async () => {
		if (!userData.data || !selectedContact || !type.trim()) return;

		const message: Message = {
			id: uuidv4(),
			content: type.trim(),
			contactRef: '',
			readAt: 'none',
			writtenAt: new Date(),
			receivedAt: 'none',
			sentAt: 'none',
			authorId: userData.data.id,
			recipientId: selectedContact?.id,
		};

		addMessageAsyncDB({ ...message, contactRef: message.authorId + message.recipientId });

		bringToTop(message.recipientId);

		addMessage({
			contactId: selectedContact?.id,
			message: { ...message, contactRef: message.authorId + message.recipientId },
		});

		socket.send(
			toBinary(
				JSON.stringify({
					event: 'send_message',
					payload: {
						message: { ...message, readAt: null, receivedAt: null, sentAt: null },
						sender: userData.data.id,
						receiver: selectedContact.id,
					},
				})
			)
		);

		setType('');
	}, [socket, type, userData.data, selectedContact]);

	function typing(value: string) {
		function handle(typing: boolean) {
			socket.send(
				toBinary(
					JSON.stringify({
						event: 'send_typing',
						payload: {
							typing,
							recipientId: selectedContact?.id,
							authorId: userData.data?.id,
						},
					})
				)
			);
		}

		if (value && !type) handle(true);
		else if (!value && type) handle(false);

		setType(value);
	}

	useEffect(() => {
		if (!textAreaRef.current) return;

		function event(e: KeyboardEvent) {
			if (e.key === 'Enter' && !e.shiftKey) {
				e.preventDefault();
				sendMessage();
			}
		}

		textAreaRef.current.addEventListener('keydown', event);
		return () => textAreaRef.current?.removeEventListener('keydown', event);
	}, [textAreaRef.current, sendMessage]);

	return (
		<Input.Group className="mt-auto flex w-full">
			<Input.Label className="sr-only">Type a message</Input.Label>

			<Input.Wrapper className="w-full h-fit">
				<Input
					inputRef={textAreaRef}
					type="text"
					className="max-h-[20rem] min-h-[3.5rem] resize-none flex flex-1 py-3 focus:outline-none"
					placeholder="Type your message"
					value={type}
					autoFocus
					onChange={e => typing(e.target.value)}
				/>

				<Button
					type="button"
					title="Send message"
					onClick={sendMessage}
					className="p-2 absolute right-3 top-2/4 -translate-y-2/4 min-w-[2.75rem] min-h-[2.75rem] max-w-[2.75rem] max-h-[2.75rem] mt-auto rounded-[10px]"
				>
					<PaperPlaneTilt className="text-white" size={24} />
				</Button>
			</Input.Wrapper>
		</Input.Group>
	);
}
