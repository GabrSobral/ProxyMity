import { browser } from '$app/environment';
import { writable, type Writable } from 'svelte/store';

export const chatWorker: Writable<Worker | null> = writable(null);

export const loadWorker = async () => {
	const SyncWorker = await import('$lib/modules/chat/workers/db-worker/db-worker?worker');
	chatWorker.set(new SyncWorker.default());
};

if (browser) {
	loadWorker();
	console.log('⚙️ \u001b[32m Database Web Worker was initialized.');
}
