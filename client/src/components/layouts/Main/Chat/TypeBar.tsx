import { FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import { Send } from 'react-feather';
import { v4 as uuidv4 } from 'uuid';

import { useChat } from '../../../../contexts/chat-context/hook';
import { useWebSocket } from '../../../../contexts/websocket-context/hook';
import { useUser } from '../../../../contexts/user-context/hook';

import { addMessageAsyncDB } from '../../../../services/database/use-cases/add-message';
import { Message } from '../../../../types/message';
import { Input } from '../../../elements/Input';
import { toBinary } from '../../../../utils/binary-parser';
import { Button } from '../../../elements/Button';

export function TypeBar() {
	const textAreaRef = useRef<HTMLTextAreaElement>(null);
	const [writingsChats, setWritingsChats] = useState<{ contactId: string; type: string }[]>([]);
	const [type, setType] = useState('');

	const { userState } = useUser();
	const { contactsState, messagesDispatch, contactsDispatch } = useChat();
	const { socket } = useWebSocket();

	function adjustTextAreaHeight(value: string) {
		if (!textAreaRef?.current) return;

		if (value === '') textAreaRef.current.style.height = '3.5rem';
		else textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight / 16}rem`;
	}

	const sendMessage = useCallback(
		async (event?: FormEvent) => {
			if (event) event.preventDefault();
			if (!userState.data || !contactsState.selectedContact || !type.trim()) return;

			const message: Message = {
				id: uuidv4(),
				content: type.trim(),
				readAt: null,
				writtenAt: new Date(),
				receivedAt: null,
				sentAt: null,
				authorId: userState.data.id,
				recipientId: contactsState.selectedContact?.id,
			};

			addMessageAsyncDB(message);

			contactsDispatch({ type: 'BRING_TO_TOP', payload: { contactId: message.recipientId } });
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
		},
		[socket, type, userState.data, contactsState.selectedContact]
	);

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

	function typing(value: string) {
		function handle(typing: boolean) {
			socket.send(
				toBinary(
					JSON.stringify({
						event: 'send_typing',
						payload: {
							typing,
							recipientId: contactsState.selectedContact?.id,
							authorId: userState.data?.id,
						},
					})
				)
			);
		}

		if (value && !type) handle(true);
		else if (!value && type) handle(false);

		setType(value);
		adjustTextAreaHeight(value);
	}

	// const selectedChat = writingsChats.find(
	// 	chat => chat.contactId === contactsState.selectedContact?.id
	// );

	// useEffect(() => {
	// 	setWritingsChats(state => {
	// 		const i = state.findIndex(item => item.contactId === contactsState.selectedContact?.id);
	// 		state[i].type = type;

	// 		return { ...state };
	// 	});
	// }, [contactsState.selectedContact]);

	return (
		<div className="mb-3 flex gap-4 px-4">
			<form action="" className="w-full flex flex-1 gap-2" onSubmit={sendMessage}>
				<Input.Group className="bg-white rounded-lg">
					<Input.Label className="sr-only">Type a message</Input.Label>

					<Input.InputWrapper className="w-full h-fit">
						<Input
							asChild
							className="max-h-[20rem] min-h-[3.5rem] resize-none flex flex-1 py-3 focus:outline-none"
							placeholder="Message"
							value={type}
							onChange={e => typing(e.target.value)}
						>
							<textarea ref={textAreaRef} />
						</Input>
					</Input.InputWrapper>
				</Input.Group>

				<Button
					type="submit"
					title="Send message"
					className="min-w-[3.5rem] min-h-[3.5rem] max-w-[3.5rem] max-h-[3.5rem] mt-auto rounded-full"
				>
					<Send className="text-lg text-white" />
				</Button>
			</form>
		</div>
	);
}
