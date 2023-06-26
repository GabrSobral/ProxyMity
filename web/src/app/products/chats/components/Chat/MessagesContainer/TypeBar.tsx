'use client';

import { v4 as uuidv4 } from 'uuid';
import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import { PaperPlaneTilt, X } from '@phosphor-icons/react';

import { Input } from '@/@design-system/Input';
import { Button } from '@/@design-system/Button';

import { useUserStore } from '@/stores/user';
import { useContactStore } from '@/stores/contacts';
import { useMessageStore } from '@/stores/messages';

import { useWebSocket } from '@/app/products/chats/contexts/websocket-context/hook';

import { Message } from '@/types/message';

import { addMessageAsyncDB } from '@/services/database/use-cases/add-message';
import { changeMessageStatusAsyncDB } from '@/services/database/use-cases/change-message-status';

import { useChat } from '../../../contexts/chat-context/hook';
import { sendTypingWebSocketEvent } from '../../../contexts/websocket-context/emmiters/sendTyping';
import { sendMessageWebSocketEvent } from '../../../contexts/websocket-context/emmiters/sendMessage';

export function TypeBar() {
	const { socket } = useWebSocket();
	const { typebarRef } = useChat();
	const userData = useUserStore(store => store.state);

	const { addMessage, saveTypeMessageFromContact, removeReplyMessageFromContact } = useMessageStore(
		store => store.actions
	);
	const { contacts } = useMessageStore(store => store.state);

	const selectedContact = useContactStore(store => store.state.selectedContact);
	const { bringToTop } = useContactStore(store => store.actions);

	const [type, setType] = useState('');
	const [selectedContactMessage, setSelectedContactMessage] = useState<(typeof contacts)[0] | null>(null);

	useEffect(() => {
		setSelectedContactMessage(contacts.find(item => item.id === selectedContact?.id) || null);
	}, [contacts, selectedContact?.id]);

	useEffect(() => {
		if (selectedContactMessage) {
			setType(selectedContactMessage?.typeMessage || '');
		}
	}, [selectedContactMessage]);

	const sendMessage = useCallback(async () => {
		if (!userData.data || !selectedContact || !type.trim()) return;

		const repliedMessage = (() => {
			if (
				selectedContactMessage?.replyMessage &&
				selectedContactMessage.replyMessage.repliedMessage &&
				typeof selectedContactMessage.replyMessage.repliedMessage === 'object'
			) {
				return {
					...selectedContactMessage?.replyMessage,
					repliedMessage: selectedContactMessage?.replyMessage.repliedMessage.id,
				};
			} else {
				return selectedContactMessage?.replyMessage;
			}
		})();

		console.log({ repliedMessage });

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
			repliedMessage: repliedMessage || null,
		};

		addMessageAsyncDB({ ...message, contactRef: message.authorId + message.recipientId });

		bringToTop(message.recipientId);

		addMessage({
			contactId: selectedContact?.id,
			message: { ...message, contactRef: message.authorId + message.recipientId },
		});

		sendMessageWebSocketEvent(socket, {
			message: { ...message, readAt: 'none', receivedAt: 'none', sentAt: new Date() },
			sender: userData.data.id,
			receiver: selectedContact.id,
		});

		changeMessageStatusAsyncDB({ messageId: message.id, status: 'sent' });

		saveTypeMessageFromContact({ contactId: selectedContact.id, typeMessage: '' });
		setType('');
		removeReplyMessageFromContact({ contactId: selectedContact.id });
	}, [
		userData.data,
		selectedContact,
		type,
		selectedContactMessage?.replyMessage,
		bringToTop,
		addMessage,
		socket,
		saveTypeMessageFromContact,
		removeReplyMessageFromContact,
	]);

	function typing(value: string) {
		function handle(typing: boolean) {
			sendTypingWebSocketEvent(socket, {
				typing,
				recipientId: selectedContact?.id || '',
				authorId: userData.data?.id || '',
			});
		}

		if (value && !type) {
			handle(true);
		} else if (!value && type) {
			handle(false);
		}

		setType(value);
	}

	useEffect(() => {
		const inputRef = typebarRef;

		if (!inputRef.current) return;

		function event(e: KeyboardEvent) {
			if (e.key === 'Enter' && !e.shiftKey) {
				e.preventDefault();
				sendMessage();
			}
		}

		inputRef.current.addEventListener('keydown', event);
		return () => inputRef.current?.removeEventListener('keydown', event);
	}, [sendMessage, typebarRef]);

	useEffect(() => {
		if (selectedContactMessage?.replyMessage) {
			typebarRef.current?.focus();
		}
	}, [selectedContactMessage?.replyMessage, typebarRef]);

	return (
		<div className="flex flex-col gap-2 m-1 mt-auto">
			<AnimatePresence mode="popLayout">
				{selectedContactMessage?.replyMessage && (
					<motion.div
						className="w-full p-2 flex gap-2 bg-black rounded-lg"
						initial={{ opacity: 0, y: 40 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: 40 }}
					>
						<div className="bg-gray-950 w-full p-2 rounded-md flex flex-col gap-1">
							<span className="text-purple-300 text-xs">{selectedContact?.name}</span>
							<span className="text-white text-sm">{selectedContactMessage?.replyMessage.content}</span>
						</div>

						<button
							type="button"
							title="Cancel reply message"
							onClick={() => removeReplyMessageFromContact({ contactId: selectedContact?.id || '' })}
							className="ml-auto bg-gray-900 hover:brightness-125 flex items-center justify-center rounded-full max-w-[2.5rem] min-w-[2.5rem] max-h-[2.5rem] min-h-[2.5rem]"
						>
							<X size={24} color="white" />
						</button>
					</motion.div>
				)}
			</AnimatePresence>

			<Input.Group className="flex w-full">
				<Input.Label className="sr-only">Type a message</Input.Label>

				<Input.Wrapper className="w-full h-fit">
					<Input
						inputRef={typebarRef}
						type="text"
						className="max-h-[20rem] min-h-[3.5rem] resize-none flex flex-1 py-3 focus:outline-none"
						placeholder="Type your message"
						value={type}
						autoFocus
						autoComplete="off"
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
		</div>
	);
}
