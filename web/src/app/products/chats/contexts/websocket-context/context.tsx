'use client';

import { createContext, ReactNode, useEffect, useMemo, useRef } from 'react';

import { useAuth } from '@/contexts/auth-context/hook';

import { eventsHandler } from './handler';
import { sendConnectionWebSocketEvent } from './emmiters/sendConnection';
import { sendDisconnectionWebSocketEvent } from './emmiters/sendDisconnection';

interface WebSocketContextProps {
	socket: WebSocket;
}

export const WebSocketContext = createContext({} as WebSocketContextProps);

export function WebSocketProvider({ children }: { children: ReactNode }) {
	const { user } = useAuth();
	const isFirstTime = useRef(true);

	const socket = useMemo(() => {
		const connection = new WebSocket(process.env.NEXT_PUBLIC_WS_API_DOMAIN || '');
		connection.binaryType = 'arraybuffer';

		return connection;
	}, []);

	useEffect(() => {
		if (user?.id && isFirstTime.current && socket) {
			sendConnectionWebSocketEvent(socket, { id: user?.id || '' });
			isFirstTime.current = false;
		}

		const handler = () => {
			if (user?.id && isFirstTime.current && socket) {
				sendConnectionWebSocketEvent(socket, { id: user?.id || '' });
				isFirstTime.current = false;
			}
		};

		socket.addEventListener('open', handler);
		return () => socket.removeEventListener('open', handler);
	}, [user?.id, socket]);

	useEffect(() => {
		socket.addEventListener('message', eventsHandler);
		return () => socket.removeEventListener('message', eventsHandler);
	}, [socket]);

	useEffect(() => {
		const handler = () => {
			if (socket && user?.id) {
				sendDisconnectionWebSocketEvent(socket, { id: user?.id || '' });
			}
		};

		socket.addEventListener('close', handler);
		return () => socket.removeEventListener('close', handler);
	}, [socket, user?.id]);

	return socket ? <WebSocketContext.Provider value={{ socket }}>{children}</WebSocketContext.Provider> : null;
}
