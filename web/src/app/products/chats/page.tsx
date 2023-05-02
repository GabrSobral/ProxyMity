import { Chat } from './components/Chat';
import { ContactSidebar } from './components/ContactSidebar';
import { ConversationDetail } from './components/ConversationDetail';

import { ChatProvider } from './contexts/chat-context/context';

export const metadata = {
	title: 'ProxyMity - Chats',
	description: 'Generated by create next app',
	icons: {
		icon: '/favicon.svg',
	},
};

export default function Home() {
	return (
		<ChatProvider>
			<main className="flex flex-1 p-4 h-full gap-4 overflow-hidden m-auto max-w-[1366px] w-full">
				<ContactSidebar />
				<Chat />
				<ConversationDetail />
			</main>
		</ChatProvider>
	);
}