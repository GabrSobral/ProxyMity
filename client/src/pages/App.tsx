import { Chat } from '../components/layouts/Main/Chat';
import { SideBar } from '../components/layouts/Main/SideBar';

import { ChatProvider } from '../contexts/chat-context/context';
import { EncryptionProvider } from '../contexts/encryption-context/context';
import { WebSocketProvider } from '../contexts/websocket-context/context';

function App() {
	Notification.requestPermission();
	return (
		<div className="w-screen h-screen bg-gray-100 dark:bg-gray-900 max-h-screen flex">
			<EncryptionProvider>
				<WebSocketProvider>
					<ChatProvider>
						<SideBar />
						<Chat />
					</ChatProvider>
				</WebSocketProvider>
			</EncryptionProvider>
		</div>
	);
}

export default App;
