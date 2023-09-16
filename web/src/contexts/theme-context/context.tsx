'use client';

import { createContext, ReactNode, useEffect, useState } from 'react';

interface ThemeContextProps {
	changeTheme: (theme: 'dark' | 'light' | 'system') => void;
	isDark: boolean;
	theme: 'light' | 'dark' | 'system';
}

export const ThemeContext = createContext({} as ThemeContextProps);

export function ThemeProvider({ children }: { children: ReactNode }) {
	const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');

	useEffect(() => {
		const currentTheme = localStorage.getItem(`@proxymity_theme`) as 'light' | 'dark' | 'system' | null;

		if (currentTheme && currentTheme !== 'system') {
			setTheme(currentTheme);
		} else {
			setTheme('system');
		}
	}, []);

	useEffect(() => {
		if (theme === 'system') {
			const darkThemeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

			if (darkThemeMediaQuery.matches) {
				return document.documentElement.setAttribute('class', 'dark');
			} else {
				return document.documentElement.setAttribute('class', 'light');
			}
		}

		return document.documentElement.setAttribute('class', theme);
	}, [theme]);

	const changeTheme = (theme: 'dark' | 'light' | 'system') => {
		localStorage.setItem(`@proxymity_theme`, theme);
		setTheme(theme);
	};

	return (
		<ThemeContext.Provider value={{ changeTheme, isDark: theme === 'dark', theme }}>{children}</ThemeContext.Provider>
	);
}
