import { browser } from '$app/environment';
import { writable, type Writable } from 'svelte/store';

export type ITheme = 'light' | 'dark' | 'system';
export type IAppColor = 'purple' | 'red' | 'blue' | 'gray' | 'green';

export const localStorageThemeKeyName = '@proxymity_theme';
export const localStorageAppColorKeyName = '@proxymity_app_color';

export const appTheme: Writable<ITheme> = writable('system');
export const appColor: Writable<IAppColor> = writable('purple');

export function setAppColor(color: IAppColor) {
   appColor.set(color);
   localStorage.setItem(localStorageAppColorKeyName, color);
}

export function setTheme(theme: ITheme) {
   if (browser) {
      appTheme.set(theme);
      localStorage.setItem(localStorageThemeKeyName, theme);

      if (theme === 'system') {
         const darkThemeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
         document.documentElement.setAttribute('class', darkThemeMediaQuery.matches ? 'dark' : 'light');
         return;
      }

      document.documentElement.setAttribute('class', theme);
   } else {
      console.error('Function allowed only on browser.');
   }
}
