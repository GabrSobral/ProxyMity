'use client';

import { createContext, ReactNode, useEffect, useMemo } from 'react';
import {
	HttpTransportType,
	HubConnection,
	HubConnectionBuilder,
	HubConnectionState,
	LogLevel,
	TransferFormat,
} from '@microsoft/signalr';

import { useAuth } from '@/contexts/auth-context/hook';

// import { eventsHandler } from './handler';

interface WebSocketContextProps {
	connection: HubConnection | null;
}

export const WebSocketContext = createContext({} as WebSocketContextProps);

export function WebSocketProvider({ children }: { children: ReactNode }) {
	const { accessToken } = useAuth();

	const connection = useMemo(() => {
		if (accessToken) {
			return new HubConnectionBuilder()
				.withUrl('http://localhost:5000/chat', {
					accessTokenFactory: () => accessToken || '',
					logMessageContent: true,
					transport: HttpTransportType.WebSockets,
					skipNegotiation: true,
					withCredentials: true,
				})
				.configureLogging(LogLevel.Information)
				.build();
		} else {
			return null;
		}
	}, [accessToken]);

	useEffect(() => {
		if (
			connection &&
			connection?.state !== HubConnectionState.Connected &&
			connection?.state !== HubConnectionState.Connecting
		) {
			connection.start().then(async () => {
				console.log('Client connected to hub.');

				connection.invoke('OnSendTyping', {
					typing: true,
					conversationId: '',
					authorId: '0203d03e-4b4b-4156-9e6a-03ff266e35cf',
				});
			});
		}
	}, [connection]);

	// useEffect(() => {
	// 	socket.addEventListener('message', eventsHandler);
	// 	return () => socket.removeEventListener('message', eventsHandler);
	// }, [socket]);

	// useEffect(() => {
	// 	const handler = () => {
	// 		if (socket && user?.id) {
	// 			sendDisconnectionWebSocketEvent(socket, { id: user?.id || '' });
	// 		}
	// 	};

	// 	socket.addEventListener('close', handler);
	// 	return () => socket.removeEventListener('close', handler);
	// }, [socket, user?.id]);

	return (
		<WebSocketContext.Provider
			value={{
				connection,
			}}
		>
			{children}
		</WebSocketContext.Provider>
	);
}