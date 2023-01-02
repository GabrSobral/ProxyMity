import { Chat } from '../components/layouts/Main/Chat';
import { SideBar } from '../components/layouts/Main/SideBar';
import { ChatProvider } from '../contexts/chat-context/context';

import { WebSocketProvider } from '../contexts/websocket-context/context';

function App() {
	return (
		<div className="w-screen h-screen bg-gray-100 dark:bg-gray-900 max-h-screen flex">
			<WebSocketProvider>
				<ChatProvider>
					<SideBar />
					<Chat />
				</ChatProvider>
			</WebSocketProvider>
		</div>
	);
}

export default App;
