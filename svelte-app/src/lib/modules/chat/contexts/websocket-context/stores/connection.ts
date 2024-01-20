import { writable } from 'svelte/store';
import type { HubConnection } from '@microsoft/signalr';
import { WebSocketEmmiter } from '../WebSocketEmitter';

export const connection = writable<HubConnection | null>(null);
export const webSocketEmmiter = writable<WebSocketEmmiter>();

connection.subscribe(state => {
    webSocketEmmiter.set(new WebSocketEmmiter(state))
})