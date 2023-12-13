import { Heading } from '@/@design-system/Heading';
import { Text } from '@/@design-system/Text';
import { useTheme } from '@/contexts/theme-context/hook';
import { Laptop, Moon, Sun } from '@phosphor-icons/react';

export function Appearance() {
	const { changeTheme, theme } = useTheme();

	return (
		<section className="flex flex-col flex-1 gap-4 dark:bg-gray-800 bg-white shadow-lg rounded-lg p-6 transition-all">
			<Heading size="md">Appearance</Heading>

			<div className="w-full h-[1px] dark:bg-slate-800 bg-gray-200 transition-colors" />

			<div className="flex flex-col gap-4">
				<Heading size="sm" asChild>
					<h3>Theme</h3>
				</Heading>

				{theme !== 'system' ? (
					<Text size="md">Your current theme is {theme}.</Text>
				) : (
					<Text size="md">Your current theme is defined by your system.</Text>
				)}

				<div className="flex gap-4">
					<button
						type="button"
						title="Set to Light Theme"
						onClick={() => changeTheme('light')}
						aria-label="Set to Light Theme"
						data-is-active={theme === 'light'}
						className="data-[is-active=true]:ring-purple-500 ring-0 data-[is-active=true]:ring-2 rounded-full p-3 bg-white w-[56px] h-[56px] min-w-[56px] min-h-[56px] transition-all hover:brightness-75 flex items-center justify-center shadow-lg"
					>
						<Sun className="text-gray-700" size={24} weight="fill" />
					</button>

					<button
						type="button"
						title="Set to Dark Theme"
						onClick={() => changeTheme('dark')}
						aria-label="Set to Dark Theme"
						data-is-active={theme === 'dark'}
						className="data-[is-active=true]:ring-purple-500 ring-0 data-[is-active=true]:ring-2 rounded-full p-3 bg-gray-800 w-[56px] h-[56px] min-w-[56px] min-h-[56px] transition-all hover:brightness-75 flex items-center justify-center shadow-lg"
					>
						<Moon className="text-white" size={24} weight="fill" />
					</button>

					<button
						type="button"
						title="Set to System Theme"
						onClick={() => changeTheme('system')}
						aria-label="Set to System Theme"
						data-is-active={theme === 'system'}
						className="data-[is-active=true]:ring-purple-500 ring-0 data-[is-active=true]:ring-2 dark:border-gray-700 rounded-full p-3 bg-transparent w-[56px] h-[56px] min-w-[56px] min-h-[56px] transition-all hover:brightness-75 flex items-center justify-center shadow-lg"
					>
						<Laptop className="dark:text-white text-gray-700 transition-colors" size={24} weight="fill" />
					</button>
				</div>
			</div>

			<div className="w-full h-[1px] dark:bg-slate-800 bg-gray-200 transition-colors" />
		</section>
	);
}
