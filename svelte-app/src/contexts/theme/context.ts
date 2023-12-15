import { browser } from '$app/environment';
import { getContext, setContext } from 'svelte';
import { writable, type Writable } from 'svelte/store';

export type ITheme = 'light' | 'dark' | 'system';

const contextName = 'appTheme';
const localStorageKeyName = '@proxymity_theme';

export const appTheme: Writable<ITheme> = writable('system');

appTheme.subscribe(value => {
	if (browser) {
		localStorage.setItem(localStorageKeyName, value);

		if (value === 'system') {
			const darkThemeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

			if (darkThemeMediaQuery.matches) {
				return document.documentElement.setAttribute('class', 'dark');
			} else {
				return document.documentElement.setAttribute('class', 'light');
			}
		}

		document.documentElement.setAttribute('class', value);
	}
});

export const setAppThemeContext = () => setContext<Writable<ITheme>>(contextName, appTheme);
export const getAppThemeContext = () => getContext<Writable<ITheme>>(contextName);
