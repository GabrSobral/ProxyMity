import clsx from 'clsx';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { Clock, ShareFat } from '@phosphor-icons/react';
import { Fragment, useEffect, useState } from 'react';

import { Message } from '@/types/message';

import { useAuth } from '@/contexts/auth-context/hook';
import { Events, ExtractPayloadType } from '../../../contexts/websocket-context/handler';
import { useChatsStore } from '../../../contexts/chat-context/stores/chat';

import { changeMessageStatusAsyncDB } from '@/services/database/use-cases/change-message-status';

interface Props {
	previousMessage?: Message;
	message: Message;
}

const formatter = Intl.DateTimeFormat('pt-br', { hour: 'numeric', minute: 'numeric' });

export function Message({ message, previousMessage }: Props) {
	const { user } = useAuth();
	const { updateConversationMessageStatus, setReplyMessageFromConversation } = useChatsStore();
	const [isMessageConfigVisible, setIsMessageConfigVisible] = useState(false);
	const [status, setStatus] = useState<'sent' | 'received' | 'read' | 'wrote'>(() => {
		if (message.readByAllAt !== null) return 'read';
		if (message.receivedByAllAt !== null) return 'received';
		if (message.sentAt !== null) return 'sent';

		return 'wrote';
	});

	const selectTimeToShow = (isMine: boolean, message: Message) =>
		isMine
			? formatter.format(new Date(message.writtenAt))
			: message.receivedByAllAt && new Date(message.receivedByAllAt) !== null
			? formatter.format(new Date(message.receivedByAllAt))
			: null;

	const isMine = message.authorId === user?.id;
	const previousIsFromUser = previousMessage?.authorId === message.authorId;

	const timeToShow = selectTimeToShow(isMine, message);

	//🟡 Receive a message that has the status changed, and update it on react state and IndexedDB
	useEffect(() => {
		function handler(event: CustomEventInit<ExtractPayloadType<'receive_message_status', Events>>) {
			if (!event.detail) {
				return;
			}

			const { messageId, status: newStatus, conversationId } = event.detail;

			if (newStatus && messageId && conversationId) {
				setStatus(newStatus);
				updateConversationMessageStatus({ conversationId, messageId: message.id, status: newStatus });
				changeMessageStatusAsyncDB({ messageId: messageId, status: newStatus });
			}
		}

		addEventListener(message.id, handler);
		return () => removeEventListener(message.id, handler);
	}, [message.id, updateConversationMessageStatus]);

	//🟡 Receive the "read" message status from another user, and update it at state
	useEffect(() => {
		function handler(event: CustomEventInit<ExtractPayloadType<'receive_read_message', Events>>) {
			const conversationId = event.detail?.conversationId || '';

			if (conversationId === message.conversationId && message.readByAllAt === null) {
				console.log('@ws.receive_message_status', conversationId);
				setStatus('read');
			}
		}

		addEventListener('@ws.receive_read_message', handler);
		return () => removeEventListener('@ws.receive_read_message', handler);
	}, [message.conversationId, message.readByAllAt]);

	return (
		<motion.li
			initial={{ opacity: 0, x: 10 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: 10 }}
			onMouseOver={() => setIsMessageConfigVisible(true)}
			onMouseOut={() => setIsMessageConfigVisible(false)}
			className="flex flex-col gap-1  rounded-[1rem] w-full"
		>
			<div
				className={clsx(
					'flex items-center gap-3 sticky dark:bg-gray-900 bg-white transition-colors p-1 px-2 rounded-full w-fit -top-3',
					{
						'ml-auto': isMine,
					}
				)}
			>
				{!isMine && !previousIsFromUser && (
					<Fragment>
						<Image
							src="https://github.com/diego3g.png"
							alt="User Photo"
							width={30}
							height={30}
							className="min-w-[30px] min-h-[30px] rounded-full z-0 shadow-xl"
						/>
						<span className="dark:text-gray-200 text-gray-700 transition-colors text-xs">Diego</span>
					</Fragment>
				)}

				<span className="dark:text-gray-300 text-gray-700 transition-colors text-xs ml-2 flex items-center gap-2">
					{isMine &&
						(status === 'wrote' ? (
							<Clock size={13} className="dark:text-gray-100 text-gray-600 transition-colors" />
						) : (
							<div
								title={status}
								className={clsx('w-6 h-3 rounded-full flex items-center p-[2px] transition-all', {
									'justify-end bg-transparent': status === 'sent',
									'justify-end dark:bg-gray-600 bg-gray-300': status === 'received',
									'justify-start bg-purple-500': status === 'read',
								})}
							>
								<div className="rounded-full w-2 h-2 bg-white transition-all" />
							</div>
						))}

					{timeToShow}
				</span>
			</div>

			<div className={clsx('flex items-center gap-2', { 'flex-row-reverse': isMine })}>
				<div
					className={clsx('w-fit rounded-[12px] text-white font-light text-sm shadow z-[13] p-1 min-w-[100px]', {
						'bg-gray-950 rounded-tl-none': !isMine,
						'bg-purple-500 rounded-tr-none': isMine,
					})}
				>
					{message.repliedMessage && (
						<div
							className={clsx('dark:bg-black bg-white transition-colors p-2 rounded-[8px] w-full flex flex-col', {
								'ml-auto': isMine,
							})}
						>
							<span className="text-purple-300 text-xs">{'Typescript'}</span>
							<span className="text-gray-200 text-sm">
								{typeof message.repliedMessage === 'object' ? message.repliedMessage?.content : null}
							</span>
						</div>
					)}
					<p className="p-1">{message.content}</p>
				</div>

				<AnimatePresence>
					{isMessageConfigVisible && (
						<motion.button
							className="p-2 bg-gray-700 shadow-lg z-10 rounded-full"
							initial={{ opacity: 0, x: isMine ? 10 : -10 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: isMine ? 10 : -10 }}
							onClick={() => setReplyMessageFromConversation({ conversationId: message.conversationId, message })}
						>
							<ShareFat size={16} color="white" weight="fill" />
						</motion.button>
					)}
				</AnimatePresence>
			</div>
		</motion.li>
	);
}
