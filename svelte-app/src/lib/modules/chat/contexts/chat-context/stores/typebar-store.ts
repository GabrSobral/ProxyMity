import { writable } from 'svelte/store';

export const typebarRef = writable<HTMLInputElement | null>(null);
