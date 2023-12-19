'use client';

import { createContext, ReactNode, useEffect, useMemo } from 'react';
import {
	HttpTransportType,
	HubConnection,
	HubConnectionBuilder,
	HubConnectionState,
	LogLevel,
} from '@microsoft/signalr';

import { useAuth } from '@/contexts/auth-context/hook';

// import { eventsHandler } from './handler';

interface WebSocketContextProps {
	connection: HubConnection;
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
		if (connection && connection?.state === HubConnectionState.Disconnected) {
			connection.start().then(async () => console.log('Client connected to hub.'));
		}
	}, [connection]);

	return (
		connection && (
			<WebSocketContext.Provider
				value={{
					connection,
				}}
			>
				{children}
			</WebSocketContext.Provider>
		)
	);
}
