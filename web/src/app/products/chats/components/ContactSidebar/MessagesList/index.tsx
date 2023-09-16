'use client';

import { AnimatePresence } from 'framer-motion';

import { ContactItem } from './ContactItem';
import { ConversationState, useChatsStore } from '../../../contexts/chat-context/stores/chat';
import { Heading } from '@/@design-system/Heading';

export function MessagesList() {
	const { conversations } = useChatsStore();
	const allNotificationsCount = conversations.reduce((sum, item) => sum + item.notifications, 0);

	return (
		<section className="flex flex-col dark:bg-gray-900 bg-white transition-colors rounded-[10px] p-3 relative overflow-hidden flex-1">
			<Heading size="md" className="flex gap-3 items-center">
				Messages
				{allNotificationsCount > 0 && (
					<span className="bg-purple-500 text-white rounded-full p-1 text-[0.6rem] flex items-center justify-center max-w-[1.25rem] max-h-[1.25rem] min-w-[1.25rem] min-h-[1.25rem]">
						{allNotificationsCount}
					</span>
				)}
			</Heading>

			<ul className="flex flex-col gap-2 mt-4 overflow-auto rounded-[10px] h-full">
				<AnimatePresence mode="popLayout">
					{conversations.map((conversation, index) => (
						<ContactItem key={conversation.id} conversation={conversation as ConversationState} index={index} />
					))}
				</AnimatePresence>
			</ul>

			<div className="absolute bottom-0 left-0 h-16 w-full z-10 bg-gradient-to-t dark:from-gray-900 transition-all from-gray-200 pointer-events-none" />
		</section>
	);
}
