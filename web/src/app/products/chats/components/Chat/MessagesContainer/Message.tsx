import clsx from 'clsx';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { Clock, ShareFat } from '@phosphor-icons/react';
import { Fragment, useEffect, useState } from 'react';

import { Message } from '@/types/message';

import { useUserStore } from '@/stores/user';

import { Events, ExtractPayloadType } from '../../../contexts/websocket-context/handler';

import { changeMessageStatusAsyncDB } from '@/services/database/use-cases/change-message-status';
import { useMessageStore } from '@/stores/messages';

interface Props {
	previousMessage?: Message;
	message: Message;
}

const formatter = Intl.DateTimeFormat('pt-br', { hour: 'numeric', minute: 'numeric' });

const selectTimeToShow = (isMine: boolean, message: Message) =>
	isMine
		? formatter.format(message.writtenAt)
		: message.receivedAt && message.receivedAt !== 'none'
		? formatter.format(message.receivedAt)
		: null;

export function Message({ message, previousMessage }: Props) {
	const userData = useUserStore(store => store.state.data);
	const { updateContactMessageStatus, setReplyMessageFromContact } = useMessageStore(store => store.actions);

	const [isMessageConfigVisible, setIsMessageConfigVisible] = useState(false);

	const [status, setStatus] = useState<'sent' | 'received' | 'read' | 'wrote'>(() => {
		if (message.readAt !== 'none') return 'read';
		if (message.receivedAt !== 'none') return 'received';
		if (message.sentAt !== 'none') return 'sent';

		return 'wrote';
	});

	const isMine = message.authorId === userData?.id;
	const previousIsFromUser = previousMessage?.authorId === message.authorId;

	const timeToShow = selectTimeToShow(isMine, message);

	//🟡 Receive a message that has the status changed, and update it on react state and IndexedDB
	useEffect(() => {
		function handler(event: CustomEventInit<ExtractPayloadType<'receive_message_status', Events>>) {
			if (!event.detail) {
				return;
			}

			console.log('Mensagem', message.id, 'acionou aqui');

			const { messageId, status: newStatus, contactId } = event.detail;

			if (newStatus && messageId && contactId) {
				setStatus(newStatus);
				updateContactMessageStatus({ contactId, messageId: message.id, status: newStatus });
				changeMessageStatusAsyncDB({ messageId: messageId, status: newStatus });
			}
		}

		addEventListener(message.id, handler);
		return () => removeEventListener(message.id, handler);
	}, [message.id, updateContactMessageStatus]);

	//🟡 Receive the "read" message status from another user, and update it at state
	useEffect(() => {
		function handler(event: CustomEventInit<ExtractPayloadType<'receive_read_message', Events>>) {
			const contactId = event.detail?.contactId || '';

			if (contactId === message.recipientId && message.readAt === 'none') {
				console.log('@ws.receive_message_status', contactId);
				setStatus('read');
			}
		}

		addEventListener('@ws.receive_read_message', handler);
		return () => removeEventListener('@ws.receive_read_message', handler);
	}, [message.recipientId, message.readAt]);

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
				className={clsx('flex items-center gap-3 sticky bg-gray-900 p-1 px-2 rounded-full w-fit -top-3', {
					'ml-auto': isMine,
				})}
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
						<span className="text-gray-200 text-xs">Diego</span>
					</Fragment>
				)}

				<span className="text-gray-300 text-xs ml-2 flex items-center gap-2">
					{isMine &&
						(status === 'wrote' ? (
							<Clock size={13} className="text-gray-100" />
						) : (
							<div
								title={status}
								className={clsx('w-6 h-3 rounded-full flex items-center p-[2px] transition-all', {
									'justify-end bg-transparent': status === 'sent',
									'justify-end bg-gray-600': status === 'received',
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
						<div className={clsx('bg-black p-2 rounded-[8px] w-full flex flex-col', { 'ml-auto': isMine })}>
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
							onClick={() =>
								setReplyMessageFromContact({ contactId: isMine ? message.recipientId : message.authorId, message })
							}
						>
							<ShareFat size={16} color="white" weight="fill" />
						</motion.button>
					)}
				</AnimatePresence>
			</div>
		</motion.li>
	);
}
