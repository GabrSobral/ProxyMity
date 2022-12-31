import { createContext, ReactNode, useEffect, useRef } from 'react';
import { useUser } from '../user-context/hook';

interface WebSocketContextProps {
	socket: WebSocket;
}
export const WebSocketContext = createContext({} as WebSocketContextProps);

const socket = new WebSocket('ws://localhost:3001');

export function WebSocketProvider({ children }: { children: ReactNode }) {
	const { userState } = useUser();

	useEffect(() => {
		if (!userState.data) return;

		socket.onopen = () => {
			socket.send(JSON.stringify({ event: 'connect', payload: { id: userState.data?.id } }));
		};
	}, [userState.data]);

	useEffect(() => {
		async function handler(message: MessageEvent) {
			const { event, payload } = JSON.parse(message.data);

			const receiveMessageEvent = new CustomEvent('@ws.receive_message', { detail: payload });
			const sentMessageEvent = new CustomEvent('@ws.sent_message', { detail: payload });

			const events = {
				receive_message: () => dispatchEvent(receiveMessageEvent),
				sent_message: () => dispatchEvent(sentMessageEvent),
			};

			events[event]();
		}

		socket.addEventListener('message', handler);

		return () => {
			socket.removeEventListener('message', handler);
		};
	}, []);

	return (
		<WebSocketContext.Provider
			value={{
				socket,
			}}
		>
			{children}
		</WebSocketContext.Provider>
	);
}
