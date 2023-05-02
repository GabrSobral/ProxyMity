'use client';

import { AnimatePresence, motion } from 'framer-motion';

import { ChatDetailHeader } from './ChatDetailHeader';
import { useContactStore } from '@/stores/contacts';

export function ConversationDetail() {
	const selectedContact = useContactStore(store => store.state.selectedContact);
	const showContactDetail = useContactStore(store => store.state.showContactDetail);

	return (
		<AnimatePresence presenceAffectsLayout>
			{selectedContact && showContactDetail && (
				<motion.aside
					initial={{ width: 0 }}
					animate={{ width: 280 }}
					exit={{ width: 0 }}
					className="bg-gray-800 h-full w-[280px] rounded-[1rem] flex flex-col gap-4 overflow-hidden"
				>
					<ChatDetailHeader />
				</motion.aside>
			)}
		</AnimatePresence>
	);
}
