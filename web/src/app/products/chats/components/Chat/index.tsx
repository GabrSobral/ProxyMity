'use client';

import { AnimatePresence, motion } from 'framer-motion';

import { ChatHeader } from './ChatHeader';
import { MessagesContainer } from './MessagesContainer';

import { useContactStore } from '@/stores/contacts';

export function Chat() {
	const selectedContact = useContactStore(store => store.state.selectedContact);

	return (
		<AnimatePresence presenceAffectsLayout>
			{selectedContact && (
				<motion.section
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					className="bg-gray-900 rounded-[10px] overflow-hidden w-full flex-1 flex flex-col bg-[url('/chat-background.svg')] bg-cover bg-no-repeat"
				>
					<ChatHeader />
					<MessagesContainer />
				</motion.section>
			)}
		</AnimatePresence>
	);
}
