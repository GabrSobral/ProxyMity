import { browser } from '$app/environment';
import { getContext, setContext } from 'svelte';
import { writable, type Writable } from 'svelte/store';

export type ITheme = 'light' | 'dark' | 'system';

const contextName = 'appTheme';
export const localStorageKeyName = '@proxymity_theme';

export const appTheme: Writable<ITheme> = writable('system');

export function setTheme(theme: ITheme) {
   if (browser) {
      appTheme.set(theme);

      if (theme === 'system') {
         const darkThemeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
         document.documentElement.setAttribute('class', darkThemeMediaQuery.matches ? 'dark' : 'light');

         return;
      }

      localStorage.setItem(localStorageKeyName, theme);
      document.documentElement.setAttribute('class', theme);
   } else {
      console.error('Function allowed only on browser.');
   }
}

export const setAppThemeContext = () => setContext<Writable<ITheme>>(contextName, appTheme);
export const getAppThemeContext = () => getContext<Writable<ITheme>>(contextName);
