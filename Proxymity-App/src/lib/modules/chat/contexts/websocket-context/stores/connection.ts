import { writable } from 'svelte/store';
import type { HubConnection } from '@microsoft/signalr';

import { WebSocketEmitter } from '../webSocket-emitter';
import { CallWebSocketEmitter } from '../../call-context/call-webSocket-emitter';

export const connection = writable<HubConnection | null>(null);

export const webSocketEmitter = writable<WebSocketEmitter>();
export const callWebSocketEmitter = writable<CallWebSocketEmitter>();

connection.subscribe(state => {
   webSocketEmitter.set(new WebSocketEmitter(state));
   callWebSocketEmitter.set(new CallWebSocketEmitter(state));
});
