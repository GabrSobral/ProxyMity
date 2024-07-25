import { writable } from 'svelte/store';
import type { HubConnection } from '@microsoft/signalr';
import { WebSocketEmitter } from '../webSocket-emitter';

export const connection = writable<HubConnection | null>(null);
export const webSocketEmitter = writable<WebSocketEmitter>();

connection.subscribe(state => {
   webSocketEmitter.set(new WebSocketEmitter(state));
});
