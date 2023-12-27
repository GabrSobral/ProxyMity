import { writable } from 'svelte/store';
import type { HubConnection } from '@microsoft/signalr';

export const connection = writable<HubConnection | null>(null);
