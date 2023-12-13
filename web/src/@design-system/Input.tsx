'use client';

import { Slot } from '@radix-ui/react-slot';
import clsx from 'clsx';
import {
	createContext,
	Dispatch,
	ForwardedRef,
	HTMLAttributes,
	InputHTMLAttributes,
	LabelHTMLAttributes,
	ReactNode,
	RefObject,
	SetStateAction,
	useContext,
	useEffect,
	useId,
	useState,
} from 'react';
import { twMerge } from 'tailwind-merge';

export interface InputRootProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
	className?: string;
}

const inputContext = createContext(
	{} as { inputId: string; hasError: boolean; setError: Dispatch<SetStateAction<boolean>> }
);

function InputRoot({ children, className, ...rest }: InputRootProps) {
	const inputId = useId();
	const [hasError, setError] = useState(false);

	return (
		<inputContext.Provider value={{ inputId, hasError, setError }}>
			<div className={twMerge('flex flex-col gap-2 w-full', className)} {...rest}>
				{children}
			</div>
		</inputContext.Provider>
	);
}

interface InputLabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
	children: ReactNode;
}
function InputLabel({ children, ...rest }: InputLabelProps) {
	const { inputId } = useContext(inputContext);

	return (
		<label className="text-white dark:text-gray-200 font-medium" htmlFor={inputId} {...rest}>
			{children}
		</label>
	);
}

function Wrapper({ children, className }: InputRootProps) {
	return <div className={twMerge('relative w-fit', className)}>{children}</div>;
}

interface InputInputProps<T = RefObject<HTMLInputElement> | ForwardedRef<HTMLInputElement>>
	extends InputHTMLAttributes<HTMLInputElement> {
	asChild?: boolean;
	className?: string;
	inputRef?: T;
}
function InputInput({ asChild, className, inputRef, ...rest }: InputInputProps) {
	const { inputId, hasError } = useContext(inputContext);

	const Component = asChild ? Slot : 'input';

	return (
		<Component
			id={inputId}
			ref={inputRef || null}
			className={twMerge(
				clsx(
					'outline-none flex hover:ring-1 transition-all dark:ring-gray-700 ring-gray-300/30 rounded-[10px] dark:bg-gray-900 bg-white dark:text-gray-200 text-gray-700 focus:outline-purple-500 focus:ring-0 placeholder:text-gray-400 w-full p-4',
					{ 'border-red-500 dark:border-red-500': hasError }
				),
				className
			)}
			{...rest}
		/>
	);
}

function InputErrorMessage({ children, className }: InputLabelProps) {
	const { setError } = useContext(inputContext);

	useEffect(() => {
		setError(true);

		return () => setError(false);
	}, [setError]);

	return <span className={twMerge(clsx('text-red-500 text-xs', className))}>{children}</span>;
}

export const Input = Object.assign(InputInput, {
	Group: InputRoot,
	Label: InputLabel,
	Wrapper: Wrapper,
	ErrorMessage: InputErrorMessage,
});
