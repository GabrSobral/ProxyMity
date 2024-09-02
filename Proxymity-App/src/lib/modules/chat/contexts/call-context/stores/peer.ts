import { writable } from 'svelte/store';
import type { PeerBuilder } from '../functions/peer';

export const peerState = writable<PeerBuilder | null>(null);
