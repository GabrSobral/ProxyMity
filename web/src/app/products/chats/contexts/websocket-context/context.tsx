'use client';

import { createContext, ReactNode, useEffect, useMemo } from 'react';

import { useUserStore } from '@/stores/user';

import { eventsHandler } from './handler';
import { sendConnectionWebSocketEvent } from './emmiters/sendConnection';

interface WebSocketContextProps {
	socket: WebSocket;
}

export const WebSocketContext = createContext({} as WebSocketContextProps);

export function WebSocketProvider({ children }: { children: ReactNode }) {
	const userData = useUserStore(store => store.state);

	const socket = useMemo(() => {
		const webSocketUrlConnection = process.env.NEXT_PUBLIC_WS_API_DOMAIN || '';
		const instance = new WebSocket(webSocketUrlConnection);
		instance.binaryType = 'arraybuffer';

		return instance;
	}, []);

	useEffect(() => {
		if (!userData.data?.id) return;

		socket.onopen = () => sendConnectionWebSocketEvent(socket, { id: userData.data?.id || '' });
	}, [socket, userData.data?.id]);

	useEffect(() => {
		socket.addEventListener('message', eventsHandler);
		return () => socket.removeEventListener('message', eventsHandler);
	}, [socket]);

	return <WebSocketContext.Provider value={{ socket }}>{children}</WebSocketContext.Provider>;
}
