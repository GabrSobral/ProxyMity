import { PulseLoader } from 'react-spinners';
import tailwindColors from 'tailwindcss/colors';
import { AnimatePresence, motion } from 'framer-motion';

import { useAuth } from '@/contexts/auth-context/hook';
import { useChatsStore } from '../../../contexts/chat-context/stores/chat';

import { Text } from '@/@design-system/Text';
import { UserImage } from '@/@design-system/UserImage';

export function ParticipantsList() {
	const { user } = useAuth();
	const { selectedConversation } = useChatsStore();

	return (
		<ul className="p-1 flex flex-col gap-1 transition-all overflow-y-scroll">
			<AnimatePresence>
				{selectedConversation?.participants.map((participant, index) => (
					<motion.li
						key={participant.id}
						initial={{ x: -30, opacity: 0 }}
						animate={{ x: 0, opacity: 1 }}
						exit={{ x: -30, opacity: 0 }}
						transition={{ duration: 0.3, delay: index / 10 + 0.2 }}
						className="w-full relative py-2 px-3 rounded-[6px] flex gap-4 hover:opacity-90 transition-colors group dark:bg-gray-800 bg-white shadow"
					>
						<UserImage
							src={participant?.photoUrl || 'https://github.com/GabrSobral.png'}
							alt="Alt Text"
							status={'offline'}
						/>

						<div className={'flex flex-col gap-1 overflow-hidden w-full z-10'}>
							<Text size="md" className={`truncate font-medium flex items-center justify-between gap-3`}>
								{participant.name} {participant.id === user?.id && '(You)'}
								<span className="text-[12px] text-green-400 ml-auto">Online</span>
							</Text>

							<div className={'truncate flex justify-between gap-4 text-gray-200 text-sm'}>
								{false ? (
									<PulseLoader color={tailwindColors.purple['500']} size={8} title="Typing..." />
								) : (
									<Text size="sm" className="text-gray-400">
										{participant.email}
									</Text>
								)}
							</div>
						</div>
					</motion.li>
				))}
			</AnimatePresence>
		</ul>
	);
}
