import { AnimatePresence, motion } from 'framer-motion';
import { CaretDown } from '@phosphor-icons/react';
import { useEffect, RefObject, useState } from 'react';

import { Button } from '@/@design-system/Button';

interface Props {
	messageContainerRef: RefObject<HTMLUListElement>;
}

export function ScrollToBottomButton({ messageContainerRef }: Props) {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		if (!messageContainerRef.current) {
			return;
		}
		const handleScroll = () => {
			const container = messageContainerRef.current;

			if (container) {
				const isScrolledToBottom =
					container.scrollHeight - container.clientHeight <= container.scrollTop + 1;

				setIsVisible(!isScrolledToBottom);
			}
		};

		messageContainerRef.current.addEventListener('scroll', handleScroll);

		return () => {
			messageContainerRef.current?.removeEventListener('scroll', handleScroll);
		};
	}, [messageContainerRef]);

	const handleClick = () => {
		const container = messageContainerRef.current;
		if (container) {
			container.scrollTo({
				top: container.scrollHeight - container.clientHeight,
				behavior: 'smooth',
			});
		}
	};

	return (
		<AnimatePresence>
			{isVisible && (
				<motion.button
					type="button"
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -10 }}
					transition={{ duration: 0.2 }}
					title="Scroll to bottom"
					onClick={() => handleClick()}
					className="flex items-center justify-center bg-purple-400 outline-none focus:outline-purple-500 focus:ring-0 absolute rounded-full min-w-[2.5rem] min-h-[2.5rem] max-w-[2.5rem] max-h-[2.5rem] mt-auto bottom-20 right-6 ml-auto p-2"
				>
					<CaretDown className="text-white" />
				</motion.button>
			)}
		</AnimatePresence>
	);
}
