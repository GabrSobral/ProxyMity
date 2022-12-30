import { useEffect } from 'react';

import { Chat } from '../components/layouts/Main/Chat';
import { SideBar } from '../components/layouts/Main/SideBar';
import { ChatProvider } from '../contexts/chat-context/context';
import { useUser } from '../contexts/user-context/reducers/hook';

const socket = new WebSocket('ws://localhost:3001');

function App() {
	const { userState } = useUser();

	useEffect(() => {
		if (!userState.data) return;

		socket.onopen = () => {
			socket.send(
				JSON.stringify({
					event: 'connect',
					payload: {
						email: userState.data?.email,
					},
				})
			);
		};
	}, [userState]);

	return (
		<div className="w-screen h-screen bg-slate-800 max-h-screen flex">
			<ChatProvider>
				<SideBar />
				<Chat />
			</ChatProvider>
		</div>
	);
}

export default App;
