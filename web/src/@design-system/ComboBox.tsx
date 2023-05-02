import { Fragment, useState } from 'react';
import { Check, CaretDown } from '@phosphor-icons/react';
import { Combobox, Transition } from '@headlessui/react';
import clsx from 'clsx';

import { Input } from './Input';

export interface ComboBoxProps<T> {
	label: string;
	items: T[];
	value: T;
	onChange: (item: T) => void;
	getReadableValue: (item: T) => string;
	getKey: (item: T) => string | number;
}

export function ComboBox<T>({
	label,
	items,
	value,
	onChange,
	getReadableValue,
	getKey,
}: ComboBoxProps<T>) {
	const [query, setQuery] = useState('');

	const filteredData =
		query === ''
			? items
			: items.filter(item => getReadableValue(item).toLowerCase().includes(query.toLowerCase()));

	return (
		<Combobox value={value} onChange={onChange} as="div" className="relative z-20 w-full">
			<Input.Group className="w-full">
				<Combobox.Label className="text-gray-700 dark:text-whiteAlpha-900 font-medium">
					{label}
				</Combobox.Label>

				<Input.Wrapper className="w-full">
					<Input asChild>
						<Combobox.Input
							onChange={event => setQuery(event.target.value)}
							displayValue={getReadableValue}
							className="truncate pr-8"
						/>
					</Input>
					<Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2 pl-1 bg-transparent m-[2px] rounded">
						<CaretDown
							className="h-5 w-5 text-gray-700 dark:text-whiteAlpha-900"
							aria-hidden="true"
						/>
					</Combobox.Button>
				</Input.Wrapper>
			</Input.Group>

			<Transition
				as={Fragment}
				leave="transition ease-in duration-100"
				leaveFrom="opacity-100"
				leaveTo="opacity-0"
				afterLeave={() => setQuery('')}
			>
				<Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md dark:bg-gray-900 bg-white text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
					{filteredData.length === 0 && query !== '' ? (
						<div className="relative cursor-default select-none py-2 px-4 text-gray-700 dark:text-whiteAlpha-900">
							Não encontrado.
						</div>
					) : (
						filteredData.map(value => (
							<Combobox.Option
								key={getKey(value)}
								value={value}
								className={({ active }) =>
									`relative select-none py-2 pl-10 pr-4 cursor-pointer ${
										active ? 'bg-red-500 text-white' : 'text-gray-900 dark:text-whiteAlpha-900'
									}`
								}
							>
								{({ active, selected }) => (
									<Fragment>
										{selected ? (
											<span className="absolute inset-y-0 left-0 flex items-center pl-3">
												<Check
													className={clsx('h-5 w-5', {
														'text-white': active,
														'text-red-500': !active,
													})}
													aria-hidden="true"
												/>
											</span>
										) : null}

										{getReadableValue(value)}
									</Fragment>
								)}
							</Combobox.Option>
						))
					)}
				</Combobox.Options>
			</Transition>
		</Combobox>
	);
}
