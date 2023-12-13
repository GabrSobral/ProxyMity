'use client';

import { AnimatePresence, motion } from 'framer-motion';

import { ChatHeader } from './ChatHeader';
import { MessagesContainer } from './MessagesContainer';

import { useChatsStore } from '../../contexts/chat-context/stores/chat';

export function Chat() {
	const { selectedConversation } = useChatsStore();

	return (
		<AnimatePresence presenceAffectsLayout>
			{selectedConversation && (
				<motion.section
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					className="dark:bg-gray-900 bg-gray-200 transition-all rounded-[10px] overflow-hidden w-full flex-1 flex flex-col bg-[url('/chat-background.svg')] bg-cover bg-no-repeat"
				>
					<ChatHeader />
					<MessagesContainer />
				</motion.section>
			)}
		</AnimatePresence>
	);
}
