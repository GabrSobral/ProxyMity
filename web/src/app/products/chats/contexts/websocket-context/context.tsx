'use client';

import { createContext, ReactNode, useEffect, useMemo } from 'react';
import {
	HttpClient,
	HttpTransportType,
	HubConnection,
	HubConnectionBuilder,
	HubConnectionState,
	LogLevel,
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
					withCredentials: true,
				})
				.configureLogging(LogLevel.Information)
				.withAutomaticReconnect()
				.build();
		} else {
			return null;
		}
	}, [accessToken]);

	useEffect(() => {
		console.log({ connection });

		if (
			connection &&
			connection?.state !== HubConnectionState.Connected &&
			connection?.state !== HubConnectionState.Connecting
		) {
			connection.start().then(() => console.log('Client connected to hub.'));
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
