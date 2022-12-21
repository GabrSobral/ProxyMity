import clsx from 'clsx';
import { createContext, Fragment, ReactNode, useContext } from 'react';
import { Check, ChevronDown } from 'react-feather';
import { Listbox, Transition } from '@headlessui/react';

import { Input } from './Input';
import { twMerge } from 'tailwind-merge';

interface ListBoxContextProps {
	value: any;
	getReadableValue: (value: any) => string;
}

const ListBoxContext = createContext({} as ListBoxContextProps);

export interface ListBoxGroupProps {
	children: ReactNode;
	value: any;
	onChange: (newValue: any) => void;
	getReadableValue: (value: any) => string;
	className?: string;
}
function ListBoxGroup({ onChange, value, getReadableValue, children, className }: ListBoxGroupProps) {
	return (
		<ListBoxContext.Provider value={{ getReadableValue, value }}>
			<Listbox
				value={value}
				onChange={onChange}
			>
				<div className={clsx('relative', className)}>{children}</div>
			</Listbox>
		</ListBoxContext.Provider>
	);
}

interface ListboxLabelProps {
	children: ReactNode;
	className?: string;
}
function ListBoxLabel({ children, className }: ListboxLabelProps) {
	return (
		<Listbox.Label className={clsx('text-gray-700 dark:text-whiteAlpha-900 font-medium', className)}>
			{children}
		</Listbox.Label>
	);
}

interface ListboxInputProps {
	className?: string;
}
function ListBoxInput({ className }: ListboxInputProps) {
	const { getReadableValue, value } = useContext(ListBoxContext);

	return (
		<Input.Group>
			<Input asChild>
				<Listbox.Button
					title={getReadableValue(value)}
					className={twMerge(clsx('mt-2 relative pr-10 text-left min-w-[12rem] w-fit', className))}
				>
					<span className="block truncate">{getReadableValue(value)}</span>
					<span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
						<ChevronDown
							className="h-5 w-5 text-gray-700 dark:text-whiteAlpha-900"
							aria-hidden="true"
						/>
					</span>
				</Listbox.Button>
			</Input>
		</Input.Group>
	);
}

interface ListboxOptionsProps {
	children: ReactNode;
	className?: string;
}
function ListboxOptions({ children, className }: ListboxOptionsProps) {
	return (
		<Transition
			as={Fragment}
			leave="transition ease-in duration-100"
			leaveFrom="opacity-100"
			leaveTo="opacity-0"
		>
			<Listbox.Options
				className={clsx(
					'z-10 absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-gray-900 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm',
					className
				)}
			>
				{children}
			</Listbox.Options>
		</Transition>
	);
}

interface ListboxOptionProps {
	className?: string;
	value: any;
}
function ListBoxOption({ className, value }: ListboxOptionProps) {
	const { getReadableValue } = useContext(ListBoxContext);

	return (
		<Listbox.Option
			value={value}
			className={({ active }) =>
				twMerge(
					clsx(
						'relative select-none py-2 pl-10 pr-4 cursor-pointer overflow-hidden',
						{
							'bg-red-500 text-white': active,
							'text-gray-900 dark:text-whiteAlpha-900': !active,
						},
						className
					)
				)
			}
		>
			{({ selected, active }) => (
				<Fragment>
					<span className={twMerge(clsx('block font-normal break-words', { 'font-medium': selected }))}>
						{getReadableValue(value)}
					</span>

					{selected ? (
						<span className="absolute inset-y-0 left-0 flex items-center pl-3">
							<Check
								className={twMerge(
									clsx('h-5 w-5', {
										'text-white': active,
										'text-red-500': !active,
									})
								)}
								aria-hidden="true"
							/>
						</span>
					) : null}
				</Fragment>
			)}
		</Listbox.Option>
	);
}

export const ListBox = Object.assign(ListBoxGroup, {
	Label: ListBoxLabel,
	Input: ListBoxInput,
	Options: ListboxOptions,
	Option: ListBoxOption,
});
