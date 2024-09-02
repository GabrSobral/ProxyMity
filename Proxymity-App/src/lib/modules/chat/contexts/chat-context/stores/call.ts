import { writable } from 'svelte/store';
import type { CallState } from './chat-store-types';

export const callState = writable<CallState | null>(null);
