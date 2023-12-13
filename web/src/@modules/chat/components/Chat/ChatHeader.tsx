'use client';

import clsx from 'clsx';
import { PushPin, User, X } from '@phosphor-icons/react';

import { UserImage } from '@/@design-system/UserImage';

import { useAuth } from '@/contexts/auth-context/hook';
import { useChatsStore } from '../../contexts/chat-context/stores/chat';

export function ChatHeader() {
	const { user } = useAuth();
	const { selectedConversation, showConversationDetail, selectConversation, handleShowConversationDetail } =
		useChatsStore();

	const conversationName =
		selectedConversation?.groupName ||
		selectedConversation?.participants.find(item => item.id !== user?.id)?.name ||
		'';

	const contact = selectedConversation?.participants[0];

	return (
		<header className="p-3 dark:bg-black bg-white flex items-center gap-4 transition-all overflow-hidden">
			<UserImage
				height={42}
				width={42}
				src={''}
				showPlaceholder={!contact?.photoUrl}
				alt="Alt Text"
				status={'offline'}
				statusClassName="-bottom-1 -right-1"
			/>

			<h2 className="dark:text-gray-300 text-gray-500 font-light tracking-wide transition-all overflow-ellipsis">
				Conversation with <strong className="dark:text-white text-gray-700">{conversationName}</strong>
			</h2>

			<div className="flex gap-1 ml-auto">
				<button
					title="Pin chat"
					className="rounded-full p-2 dark:bg-black bg-white hover:bg-purple-500 transition-all group hover:text-white dark:dark:text-whit text-gray-700"
					type="button"
				>
					<PushPin size={24} weight="light" className="dark:text-white text-gray-700 group-hover:text-white" />
				</button>

				<button
					title="Conversation info"
					className={clsx('rounded-full p-2 hover:bg-purple-500 transition-all hover:text-white group ', {
						'bg-purple-500': showConversationDetail,
						'dark:bg-black bg-white': !showConversationDetail,
					})}
					type="button"
					onClick={handleShowConversationDetail}
				>
					<User
						size={24}
						weight="light"
						className={clsx(' group-hover:text-white', {
							'text-white': showConversationDetail,
							'dark:text-white text-gray-700': !showConversationDetail,
						})}
					/>
				</button>

				<button
					type="button"
					onClick={() => selectConversation(null)}
					title="Close chat"
					className="rounded-full p-2 dark:bg-black bg-white hover:bg-purple-500 hover:text-white group transition-all dark:text-white text-gray-700"
				>
					<X size={24} weight="light" className="dark:text-white text-gray-700 group-hover:text-white" />
				</button>
			</div>
		</header>
	);
}
