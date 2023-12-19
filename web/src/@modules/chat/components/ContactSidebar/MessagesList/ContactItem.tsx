import clsx from 'clsx';
import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';
import { PulseLoader } from 'react-spinners';
import tailwindColors from 'tailwindcss/colors';
import { ForwardedRef, forwardRef, useEffect, useState } from 'react';

import { UserImage } from '@/@design-system/UserImage';

import { useAuth } from '@/contexts/auth-context/hook';
import { useChat } from '../../../contexts/chat-context/hook';
import { ConversationState, useChatsStore } from '../../../contexts/chat-context/stores/chat';
import { useWebSocket } from '@/@modules/chat/contexts/websocket-context/hook';

interface Props {
	conversation: ConversationState;
	index: number;
}

const formatLastMessageDate = Intl.DateTimeFormat('pt-br', { hour: 'numeric', minute: 'numeric' });

export const ContactItem = forwardRef(({ conversation, index }: Props, ref: ForwardedRef<HTMLLIElement>) => {
	const [typing, setTyping] = useState(false);
	const { user } = useAuth();
	const { connection } = useWebSocket();
	const { selectConversationAsync } = useChat();
	const { selectedConversation } = useChatsStore();
	const isSelectedContact = selectedConversation?.id === conversation.id;

	const conversationName =
		conversation?.groupName || conversation?.participants.find(item => item.id !== user?.id)?.name || '';

	const contact = conversation?.participants.find(item => item.id !== user?.id);
	const lastMessage = conversation.messages?.at(-1);

	useEffect(() => {
		const eventHandler = ({
			typing,
			conversationId,
		}: {
			typing: boolean;
			authorId: string;
			conversationId: string;
		}) => {
			if (conversationId === conversation.id) {
				setTyping(typing);
			}
		};

		connection?.on('receveTyping', eventHandler);
	}, [connection, conversation.id]);

	return (
		<motion.li
			layout
			ref={ref}
			initial={{ x: -30, opacity: 0 }}
			animate={{ x: 0, opacity: 1 }}
			exit={{ x: -30, opacity: 0 }}
			transition={{ duration: 0.3, delay: index / 10 + 0.2 }}
			onClick={() => selectConversationAsync({ conversation: conversation })}
			className="w-full  relative py-2 px-3 rounded-xl flex gap-4 cursor-pointer hover:opacity-90 group dark:bg-gray-900 bg-white transition-all shadow-md"
		>
			<div
				className={`${
					isSelectedContact ? 'w-full left-0 opacity-100' : 'w-0 left-2/4 opacity-10'
				} absolute h-full bg-gradient-to-r from-[#1C64CE] border-0 to-[#B809A6] transition-all rounded-xl top-0 z-0 duration-[0.3s] mx-auto`}
			/>
			<UserImage src={contact?.photoUrl || 'https://github.com/GabrSobral.png'} alt="Alt Text" status={'offline'} />

			<div className={'flex flex-col gap-1 overflow-hidden w-full z-10'}>
				<span
					className={`${
						isSelectedContact ? 'text-white' : 'text-gray-700 dark:text-gray-200'
					} truncate font-medium flex items-center justify-between gap-3 `}
				>
					{conversationName} {conversation.id === user?.id && '(You)'}
					<span
						className="text-[12px] dark:text-gray-200 transition-colors text-gray-700 ml-auto data-[is-selected=true]:text-gray-100"
						data-is-selected={isSelectedContact}
					>
						{formatLastMessageDate.format(new Date())}
					</span>
				</span>

				<div
					className={twMerge(
						clsx('truncate flex justify-between gap-4 dark:text-gray-200 text-gray-600 text-sm', {
							'text-purple-500': typing && !isSelectedContact,
							'text-white': isSelectedContact,
						})
					)}
				>
					{typing ? (
						<PulseLoader
							color={isSelectedContact ? '#FFFFFF' : tailwindColors.purple['500']}
							size={8}
							title="Typing..."
						/>
					) : lastMessage ? (
						lastMessage.content
					) : (
						<span>Start the conversation...</span>
					)}

					{conversation.notifications > 0 && (
						<span className="rounded-full bg-purple-500 w-5 h-5 ml-auto flex items-center justify-center text-[12px] text-white font-medium animate-pulse z-10">
							{conversation.notifications}
						</span>
					)}
				</div>
			</div>
		</motion.li>
	);
});

ContactItem.displayName = 'ContactItem';
