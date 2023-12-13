import { InputHTMLAttributes, RefObject, useId } from 'react';

export interface CheckBoxProps extends InputHTMLAttributes<HTMLInputElement> {
	label: string;
	ref?: RefObject<HTMLInputElement>;
	labelClassName?: string;
}

export function CheckBox({ label, ref, labelClassName, ...rest }: CheckBoxProps) {
	const id = useId();

	return (
		<div className="relative flex items-center gap-3 text-sm text-gray-700 dark:text-gray-200 w-fit">
			<input
				id={id}
				ref={ref}
				type="checkbox"
				className="w-4 h-4 dark:bg-gray-800 bg-gray-100 accent-red-500 text-red-500 bg-transparent rounded focus:ring-red-500 focus:ring-2"
				{...rest}
			/>

			<label htmlFor={id} className={labelClassName}>
				{label}
			</label>
		</div>
	);
}
