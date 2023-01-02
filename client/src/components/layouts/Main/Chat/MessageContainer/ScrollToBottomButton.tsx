import { useEffect, RefObject, useState } from 'react';
import { ChevronDown } from 'react-feather';
import { useChat } from '../../../../../contexts/chat-context/hook';

import { Button } from '../../../../elements/Button';

interface Props {
	messageContainerRef: RefObject<HTMLDivElement>;
}

export function ScrollToBottomButton({ messageContainerRef }: Props) {
	const [isVisible, setIsVisible] = useState(false);
	const { contactsState } = useChat();

	useEffect(() => {
		const onScroll = () => {
			if (!messageContainerRef.current) return;

			setIsVisible(
				messageContainerRef.current.scrollTop <= messageContainerRef.current.scrollHeight - 440
			);
		};

		messageContainerRef.current?.addEventListener('scroll', onScroll);
		return () => messageContainerRef.current?.removeEventListener('scroll', onScroll);
	}, [messageContainerRef.current]);

	useEffect(() => {
		scrollToBottom();
	}, [contactsState.selectedContact, scrollToBottom]);

	function scrollToBottom(behavior: 'auto' | 'smooth' = 'auto') {
		messageContainerRef.current?.scrollTo({
			behavior,
			top: messageContainerRef.current.scrollHeight,
		});
	}

	return (
		<div className="relative max-h-0 w-full">
			{isVisible && (
				<Button
					type="button"
					onClick={() => scrollToBottom()}
					className="absolute rounded-full min-w-[2.25rem] min-h-[2.25rem] max-w-[2.25rem] max-h-[2.25rem] mt-auto bottom-4 right-8 ml-auto p-2"
				>
					<ChevronDown className="text-white" />
				</Button>
			)}
		</div>
	);
}
