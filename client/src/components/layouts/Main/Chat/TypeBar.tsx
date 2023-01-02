import { FormEvent, useEffect, useRef, useState } from 'react';
import { Mic, Send } from 'react-feather';
import { v4 as uuidv4 } from 'uuid';
import LZString from 'lz-string';

import { useChat } from '../../../../contexts/chat-context/hook';
import { useWebSocket } from '../../../../contexts/websocket-context/hook';
import { useUser } from '../../../../contexts/user-context/hook';

import { addMessageAsyncDB } from '../../../../services/database/use-cases/add-message';
import { Message } from '../../../../types/message';
import { Input } from '../../../elements/Input';
import { toBinary, toText } from '../../../../utils/binary-parser';

export function TypeBar() {
	const textAreaRef = useRef<HTMLTextAreaElement>(null);
	const [type, setType] = useState('');

	const { userState } = useUser();
	const { contactsState, messagesDispatch } = useChat();
	const { socket } = useWebSocket();

	function adjustTextAreaHeight(value: string) {
		if (!textAreaRef?.current) return;

		if (value === '') textAreaRef.current.style.height = '3.5rem';
		else textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight / 16}rem`;
	}

	async function sendMessage(event: FormEvent) {
		event.preventDefault();

		if (!userState.data || !contactsState.selectedContact || !type) return;

		const message: Message = {
			id: uuidv4(),
			content: type,
			readAt: null,
			writtenAt: new Date(),
			receivedAt: null,
			sentAt: null,
			authorId: userState.data.id,
			recipientId: contactsState.selectedContact?.id,
		};

		addMessageAsyncDB(message);

		messagesDispatch({
			type: 'ADD_MESSAGE',
			payload: { contactId: contactsState.selectedContact?.id, message },
		});

		socket.send(
			toBinary(
				JSON.stringify({
					event: 'send_message',
					payload: {
						message,
						sender: userState.data.id,
						receiver: contactsState.selectedContact.id,
					},
				})
			)
		);

		setType('');
	}

	function typing(value: string) {
		if (value && !type) {
			socket.send(
				toBinary(
					JSON.stringify({
						event: 'send_typing',
						payload: {
							typing: true,
							recipientId: contactsState.selectedContact?.id,
							authorId: userState.data?.id,
						},
					})
				)
			);
		} else if (!value && type) {
			socket.send(
				toBinary(
					JSON.stringify({
						event: 'send_typing',
						payload: {
							typing: false,
							recipientId: contactsState.selectedContact?.id,
							authorId: userState.data?.id,
						},
					})
				)
			);
		}

		setType(value);
		adjustTextAreaHeight(value);
	}

	return (
		<div className="mb-3 flex gap-4 px-4">
			<form action="" className="w-full flex flex-1 gap-2" onSubmit={sendMessage}>
				<Input.Group>
					<Input.Label className="sr-only">Type a message</Input.Label>

					<Input.InputWrapper className="w-full h-fit">
						<Input asChild>
							<textarea
								ref={textAreaRef}
								placeholder="Message"
								className="max-h-[20rem] min-h-[3.5rem] resize-none flex flex-1 py-3"
								value={type}
								onChange={e => typing(e.target.value)}
							/>
						</Input>
					</Input.InputWrapper>
				</Input.Group>

				<button
					type="submit"
					title="Send message"
					className="rounded-full flex items-center justify-center bg-red-500 min-w-[3.5rem] min-h-[3.5rem] max-w-[3.5rem] max-h-[3.5rem] mt-auto"
				>
					<Send className="text-lg text-white" />
				</button>
			</form>

			<button
				type="button"
				title="Record an audio"
				className="rounded-full flex items-center justify-center bg-red-500 min-w-[3.5rem] min-h-[3.5rem] max-w-[3.5rem] max-h-[3.5rem] mt-auto"
				onClick={() => {}}
			>
				<Mic className="text-lg text-white" />
			</button>
		</div>
	);
}
