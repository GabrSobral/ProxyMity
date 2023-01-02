import { createContext, ReactNode, useEffect } from 'react';

import { Message } from '../../types/message';
import { toBinary, toText } from '../../utils/binary-parser';
import { useUser } from '../user-context/hook';

interface WebSocketContextProps {
	socket: WebSocket;
}
export const WebSocketContext = createContext({} as WebSocketContextProps);

const socket = new WebSocket('ws://localhost:3001');
socket.binaryType = 'arraybuffer';

type Events =
	| {
			event: 'receive_message';
			payload: {
				message: Message;
			};
	  }
	| {
			event: 'sent_message';
			payload: {
				message: Message;
			};
	  }
	| {
			event: 'receive_typing';
			payload: {
				typing: boolean;
				authorId: string;
			};
	  };

export function WebSocketProvider({ children }: { children: ReactNode }) {
	const { userState } = useUser();

	useEffect(() => {
		if (!userState.data) return;

		socket.onopen = () => {
			socket.send(
				toBinary(JSON.stringify({ event: 'connect', payload: { id: userState.data?.id } }))
			);
		};
	}, [userState.data]);

	useEffect(() => {
		async function handler(message: MessageEvent) {
			const messageParsed = toText(new Uint8Array(message.data));
			const { event, payload } = JSON.parse(messageParsed) as Events;

			const receiveMessageEvent = new CustomEvent('@ws.receive_message', { detail: payload });
			const sentMessageEvent = new CustomEvent('@ws.sent_message', { detail: payload });
			const receiveTypingEvent = new CustomEvent('@ws.receive_typing', { detail: payload });

			const events = {
				receive_message: () => dispatchEvent(receiveMessageEvent),
				sent_message: () => dispatchEvent(sentMessageEvent),
				receive_typing: () => dispatchEvent(receiveTypingEvent),
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
