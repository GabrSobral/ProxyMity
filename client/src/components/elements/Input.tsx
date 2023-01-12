import { Slot } from '@radix-ui/react-slot';
import clsx from 'clsx';
import {
	createContext,
	ForwardedRef,
	HTMLAttributes,
	InputHTMLAttributes,
	LabelHTMLAttributes,
	ReactNode,
	RefObject,
	useContext,
	useId,
} from 'react';
import { twMerge } from 'tailwind-merge';

export interface InputRootProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
	className?: string;
}

const inputContext = createContext({} as { inputId: string });

function InputRoot({ children, className, ...rest }: InputRootProps) {
	const inputId = useId();

	return (
		<inputContext.Provider value={{ inputId }}>
			<div className={twMerge(clsx('flex flex-col gap-2 w-full', className))} {...rest}>
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
		<label
			className="text-gray-700 dark:text-whiteAlpha-900 font-medium"
			htmlFor={inputId}
			{...rest}
		>
			{children}
		</label>
	);
}

function InputWrapper({ children, className }: InputRootProps) {
	return <div className={twMerge(clsx('relative w-fit', className))}>{children}</div>;
}

interface InputInputProps<T = RefObject<HTMLInputElement> | ForwardedRef<HTMLInputElement>>
	extends InputHTMLAttributes<HTMLInputElement> {
	asChild?: boolean;
	className?: string;
	ref?: T;
}
function InputInput({ asChild, className, ref, ...rest }: InputInputProps) {
	const { inputId } = useContext(inputContext);

	const Component = asChild ? Slot : 'input';

	return (
		<Component
			id={inputId}
			ref={ref || null}
			className={twMerge(
				clsx(
					'min-h-[44px] outline-none hover:ring-1 transition-all dark:ring-gray-600 ring-gray-300 py-[0.5rem] px-4 rounded-md border-solid border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-whiteAlpha-900 focus:outline-purple-500 focus:ring-0 bg-transparent placeholder:text-[#00000057] dark:placeholder:text-gray-400 w-full',
					className
				)
			)}
			{...rest}
		/>
	);
}

export const Input = Object.assign(InputInput, {
	Group: InputRoot,
	Label: InputLabel,
	InputWrapper: InputWrapper,
});
