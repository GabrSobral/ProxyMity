'use client';

import { v4 as uuidv4 } from 'uuid';
import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import { PaperPlaneTilt, X } from '@phosphor-icons/react';

import { Input } from '@/@design-system/Input';
import { Button } from '@/@design-system/Button';

import { Message } from '@/types/message';

import { addMessageAsyncDB } from '@/services/database/use-cases/add-message';
import { changeMessageStatusAsyncDB } from '@/services/database/use-cases/change-message-status';

import { useChat } from '../../../contexts/chat-context/hook';
import { sendTypingWebSocketEvent } from '../../../contexts/websocket-context/emmiters/sendTyping';
import { sendMessageWebSocketEvent } from '../../../contexts/websocket-context/emmiters/sendMessage';

import { useAuth } from '@/contexts/auth-context/hook';
import { useChatsStore } from '../../../contexts/chat-context/stores/chat';

import { useWebSocket } from '@/@modules/chat/contexts/websocket-context/hook';

export function TypeBar() {
	const { user } = useAuth();
	const { typebarRef } = useChat();
	const { socket } = useWebSocket();

	const {
		addMessage,
		saveTypeMessageFromConversation,
		removeReplyMessageFromConversation,
		bringToTop,
		selectedConversation,
	} = useChatsStore();

	const [type, setType] = useState('');

	useEffect(() => {
		if (selectedConversation) {
			setType(selectedConversation?.typeMessage || '');
		}
	}, [selectedConversation]);

	const sendMessage = useCallback(async () => {
		if (!user || !selectedConversation || !type.trim()) return;

		const repliedMessage = (() => {
			if (
				selectedConversation?.replyMessage &&
				selectedConversation.replyMessage.repliedMessage &&
				typeof selectedConversation.replyMessage.repliedMessage === 'object'
			) {
				return {
					...selectedConversation?.replyMessage,
					repliedMessage: selectedConversation?.replyMessage.repliedMessage.id,
				};
			} else {
				return selectedConversation?.replyMessage;
			}
		})();

		const message: Message = {
			id: uuidv4(),
			content: type.trim(),

			writtenAt: new Date(),
			sentAt: null,
			receivedByAllAt: null,
			readByAllAt: null,

			conversationId: selectedConversation?.id,
			authorId: user.id,
			repliedMessage: repliedMessage || null,
		};

		addMessageAsyncDB(message);

		bringToTop(message.conversationId);

		addMessage({
			conversationId: selectedConversation?.id,
			message,
		});

		sendMessageWebSocketEvent(socket, {
			message: { ...message, readByAllAt: null, receivedByAllAt: null, sentAt: new Date() },
			sender: user.id,
			receiver: selectedConversation.id,
		});

		changeMessageStatusAsyncDB({ messageId: message.id, status: 'sent' });

		saveTypeMessageFromConversation({ conversationId: selectedConversation.id, typeMessage: '' });
		setType('');
		removeReplyMessageFromConversation({ conversationId: selectedConversation.id });
	}, [
		user,
		selectedConversation,
		type,
		bringToTop,
		addMessage,
		socket,
		saveTypeMessageFromConversation,
		removeReplyMessageFromConversation,
	]);

	function typing(value: string) {
		function handle(typing: boolean) {
			sendTypingWebSocketEvent(socket, {
				typing,
				conversationId: selectedConversation?.id || '',
				authorId: user?.id || '',
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
		if (selectedConversation?.replyMessage) {
			typebarRef.current?.focus();
		}
	}, [selectedConversation?.replyMessage, typebarRef]);

	return (
		<div className="flex flex-col gap-2 m-1 mt-auto">
			<AnimatePresence mode="popLayout">
				{selectedConversation?.replyMessage && (
					<motion.div
						className="w-full p-2 flex gap-2 bg-black rounded-lg"
						initial={{ opacity: 0, y: 40 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: 40 }}
					>
						<div className="bg-gray-950 w-full p-2 rounded-md flex flex-col gap-1">
							<span className="text-purple-300 text-xs">{'Name'}</span>
							<span className="text-white text-sm">{selectedConversation?.replyMessage.content}</span>
						</div>

						<button
							type="button"
							title="Cancel reply message"
							onClick={() => removeReplyMessageFromConversation({ conversationId: selectedConversation?.id || '' })}
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
