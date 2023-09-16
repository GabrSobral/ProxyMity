import clsx from 'clsx';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { CaretDown, UsersThree } from '@phosphor-icons/react';

import { Heading } from '@/@design-system/Heading';

import { ParticipantsList } from './ParticipantsList';
import { useChatsStore } from '../../../contexts/chat-context/stores/chat';

export function ParticipantsContainer() {
	const [isCollapsed, setIsCollapsed] = useState(false);
	const { selectedConversation } = useChatsStore();

	return (
		<motion.section
			initial={{ maxHeight: 0 }}
			animate={{ maxHeight: 400 }}
			exit={{ maxHeight: 0 }}
			className="flex flex-col dark:bg-gray-900 bg-white transition-all h-fit rounded-[10px] overflow-hidden relative shadow-md"
		>
			<Heading
				size="sm"
				className="text-white w-full dark:bg-black bg-gray-100 px-4 py-2 flex gap-2 items-center justify-between cursor-pointer hover:brightness-90 transition-all"
				onClick={() => setIsCollapsed(state => !state)}
			>
				<span className="flex gap-2 text-gray-700 dark:text-white transition-colors">
					<UsersThree size={24} className="text-gray-700 dark:text-white transition-colors" /> Participants -{' '}
					{selectedConversation?.participants.length}
				</span>

				<CaretDown
					size={24}
					className={clsx('text-gray-700 dark:text-white transition-all', {
						'rotate-180': !isCollapsed,
					})}
				/>
			</Heading>

			<div
				data-is-collapsed={isCollapsed}
				className={
					'max-h-80 h-80  data-[is-collapsed=true]:max-h-0 data-[is-collapsed=true]:h-0 transition-all overflow-hidden duration-300'
				}
			>
				{!isCollapsed && <ParticipantsList />}
			</div>

			<div
				data-is-collapsed={isCollapsed}
				className="absolute bottom-0 h-10 w-full z-10 bg-gradient-to-t data-[is-collapsed=true]:max-h-0 max-h-10 dark:from-gray-950 from-gray-200  transition-all pointer-events-none"
			/>
		</motion.section>
	);
}
