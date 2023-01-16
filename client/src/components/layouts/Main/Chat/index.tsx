import { Fragment, useRef } from 'react';

import { useChat } from '../../../../contexts/chat-context/hook';
import { ChatHeader } from './ChatHeader';
import { MessageContainer } from './MessageContainer';
import { ScrollToBottomButton } from './MessageContainer/ScrollToBottomButton';
import { TypeBar } from './TypeBar';

export function Chat() {
	const { contactsState } = useChat();
	const container = useRef<HTMLDivElement>(null);

	return (
		<main className="flex flex-col flex-1 bg-[url('./src/assets/chat-background.svg')] bg-cover bg-no-repeat rounded-lg overflow-hidden">
			{contactsState.selectedContact && (
				<Fragment>
					<ChatHeader />

					<section className="flex flex-1 w-full flex-col max-w-[40rem] mx-auto overflow-y-auto">
						<MessageContainer refContainer={container} />
						<TypeBar />
					</section>

					<ScrollToBottomButton messageContainerRef={container} />
				</Fragment>
			)}
		</main>
	);
}
