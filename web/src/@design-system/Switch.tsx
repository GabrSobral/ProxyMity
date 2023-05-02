import clsx from 'clsx';
import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';
import { Switch as HeadlessSwitch } from '@headlessui/react';

interface Props {
	checkedComponent?: ReactNode;
	nonCheckedComponent?: ReactNode;

	checked?: boolean | undefined;
	defaultChecked?: boolean | undefined;
	onChange?(checked: boolean): void;
	name?: string | undefined;
}

export function Switch({ checked, checkedComponent, nonCheckedComponent, ...rest }: Props) {
	return (
		<HeadlessSwitch
			checked={checked}
			className={twMerge(
				clsx(
					'relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 dark:bg-gray-700 transition-all',
					{
						'bg-gradient-to-r from-[#B809A6] border-0 to-[#1C64CE]': checked,
					}
				)
			)}
			{...rest}
		>
			<span className="sr-only">{checked ? 'Desabilitar' : 'Habilitar'}</span>
			<span
				className={clsx(
					'h-4 w-4 transform rounded-full bg-white transition-all flex items-center justify-center',
					{
						'translate-x-1': !checked,
						'translate-x-6': checked,
					}
				)}
			>
				{checked ? checkedComponent : nonCheckedComponent}
			</span>
		</HeadlessSwitch>
	);
}
