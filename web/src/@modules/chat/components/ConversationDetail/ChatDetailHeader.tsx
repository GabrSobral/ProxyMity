'use client';

import { PhoneCall, PushPin, SpeakerSimpleSlash, VideoCamera } from '@phosphor-icons/react';

import { UserImage } from '@/@design-system/UserImage';

import { useAuth } from '@/contexts/auth-context/hook';
import { useChatsStore } from '../../contexts/chat-context/stores/chat';

export function ChatDetailHeader() {
	const { user } = useAuth();
	const { selectedConversation } = useChatsStore();

	const conversationName =
		selectedConversation?.groupName ||
		selectedConversation?.participants.find(item => item.id !== user?.id)?.name ||
		'';

	const contact = selectedConversation?.participants[0];

	return (
		<header className="rounded-[10px] p-3 bg-purple-400 flex flex-col gap-3">
			<div className="flex gap-3">
				<UserImage
					src={contact?.photoUrl || ''}
					alt="Diego's photo"
					showPlaceholder={!contact?.photoUrl}
					width={52}
					height={52}
					status="busy"
				/>

				<div className="flex flex-col overflow-hidden">
					<strong className="text-white font-light text-lg">{conversationName}</strong>
					<span className="text-gray-200 font-light text-sm truncate">{contact?.email}</span>
				</div>
			</div>

			<div className="flex gap-3">
				<button
					type="button"
					className="brightness-125 p-2 bg-purple-400 rounded-[12px] hover:brightness-150 transition-all active:scale-90"
					title="Start a voice call with Diego"
				>
					<PhoneCall className="text-white" size={28} weight="light" />
				</button>

				<button
					type="button"
					className="brightness-125 p-2 bg-purple-400 rounded-[12px] hover:brightness-150 transition-all active:scale-90"
					title="Start a video call with Diego"
				>
					<VideoCamera className="text-white" size={28} weight="light" />
				</button>

				<button
					type="button"
					className="brightness-125 p-2 bg-purple-400 rounded-[12px] hover:brightness-150 transition-all active:scale-90"
					title="Pin Diego's conversation"
				>
					<PushPin className="text-white" size={28} weight="light" />
				</button>

				<button
					type="button"
					className="brightness-125 p-2 bg-purple-400 rounded-[12px] hover:brightness-150 transition-all active:scale-90"
					title="Mute Diego's conversation"
				>
					<SpeakerSimpleSlash className="text-white" size={28} weight="light" />
				</button>
			</div>

			<div>
				<span className="text-white font-medium">Description:</span>
				<p className="text-gray-200 font-light">Hello, everybody! 😊</p>
			</div>

			<div className="flex flex-col gap-2">
				<span className="text-white font-medium block">Badges:</span>

				<div className="flex flex-wrap gap-2">
					<span className="p-1 px-2 rounded-full bg-yellow-500 text-sm text-white w-fit">JS Developer</span>

					<span className="p-1 px-2 rounded-full bg-orange-400 text-sm text-white w-fit">Fullstack</span>

					<span className="p-1 px-2 rounded-full bg-blue-400 text-sm text-white w-fit">ReactJS</span>

					<span className="p-1 px-2 rounded-full bg-green-600 text-sm text-white w-fit">NodeJS</span>
				</div>
			</div>
		</header>
	);
}
