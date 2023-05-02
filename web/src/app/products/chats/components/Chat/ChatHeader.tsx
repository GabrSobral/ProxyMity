'use client';

import clsx from 'clsx';
import { PushPin, User, X } from '@phosphor-icons/react';

import { UserImage } from '@/@design-system/UserImage';
import { useContactStore } from '@/stores/contacts';

export function ChatHeader() {
	const { selectedContact, showContactDetail } = useContactStore(store => store.state);
	const { selectContact, handleShowContactDetail } = useContactStore(store => store.actions);

	return (
		<header className="p-3 bg-black flex items-center gap-4 transition-all">
			<UserImage
				height={42}
				width={42}
				src={selectedContact?.photoUrl || ''}
				showPlaceholder={!selectedContact?.photoUrl}
				alt="Alt Text"
				status={selectedContact?.status || 'offline'}
				statusClassName="-bottom-1 -right-1"
			/>

			<h2 className="text-gray-300 font-light tracking-wide transition-all">
				Conversation with <strong className="text-white">{selectedContact?.name}</strong>
			</h2>

			<div className="flex gap-1 ml-auto">
				<button
					title="Pin chat"
					className="rounded-full p-2 bg-black hover:bg-purple-500 transition-all text-white"
					type="button"
				>
					<PushPin size={24} weight="light" className="text-white" />
				</button>

				<button
					title="Conversation info"
					className={clsx('rounded-full p-2 hover:bg-purple-500 transition-all text-white', {
						'bg-purple-500': showContactDetail,
						'bg-black': !showContactDetail,
					})}
					type="button"
					onClick={handleShowContactDetail}
				>
					<User size={24} weight="light" className="text-white" />
				</button>

				<button
					type="button"
					onClick={() => selectContact(null)}
					title="Close chat"
					className="rounded-full p-2 bg-black hover:bg-purple-500 transition-all text-white"
				>
					<X size={24} weight="light" className="text-white" />
				</button>
			</div>
		</header>
	);
}
