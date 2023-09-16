'use client';

import { AnimatePresence, motion } from 'framer-motion';

import { ChatDetailHeader } from './ChatDetailHeader';
import { ParticipantsContainer } from './ParticipantsContainer';

import { useChatsStore } from '../../contexts/chat-context/stores/chat';

export function ConversationDetail() {
	const { selectedConversation, showConversationDetail } = useChatsStore();

	return (
		<AnimatePresence>
			{selectedConversation && showConversationDetail && (
				<motion.aside
					initial={{ width: 0 }}
					animate={{ width: 280 }}
					exit={{ width: 0 }}
					className="h-full w-[280px] rounded-[10px] flex flex-col gap-4 overflow-hidden"
				>
					<ChatDetailHeader />

					{selectedConversation.isGroup && <ParticipantsContainer />}
				</motion.aside>
			)}
		</AnimatePresence>
	);
}
