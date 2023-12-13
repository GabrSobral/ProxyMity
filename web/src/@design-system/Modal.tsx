import { twMerge } from 'tailwind-merge';
import { X } from '@phosphor-icons/react';
import { Fragment, ReactNode } from 'react';
import { Dialog, Transition } from '@headlessui/react';

export interface ModalProps {
	closeModal: () => void;
	show: boolean;
	children: ReactNode;
	className?: string;
	showCloseButton?: boolean;
}

function ModalGroup({ closeModal, show, children, className, showCloseButton = true }: ModalProps) {
	return (
		<Transition appear show={show} as={Fragment}>
			<Dialog as="div" className="relative z-30" onClose={closeModal}>
				<Transition.Child
					as={Fragment}
					enter="ease-out duration-300"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-[2px]" />
				</Transition.Child>

				<div className="fixed inset-0 overflow-y-auto flex min-h-full items-center justify-center">
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0 scale-95"
						enterTo="opacity-100 scale-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100 scale-100"
						leaveTo="opacity-0 scale-95"
					>
						<Dialog.Panel
							className={twMerge(
								'flex flex-col gap-2 m-8 max-w-[90%] overflow-hidden rounded-[1rem] bg-white dark:bg-gray-900 p-6 pt-10 text-left align-middle shadow-xl transition-all',
								className
							)}
						>
							{showCloseButton && (
								<button type="button" onClick={closeModal} title="Fechar" className="absolute top-4 right-4">
									<X size={24} className="dark:text-gray-200 text-white" />
								</button>
							)}

							{children}
						</Dialog.Panel>
					</Transition.Child>
				</div>
			</Dialog>
		</Transition>
	);
}

function ModalTitle({ children, className }: { children: ReactNode; className?: string }) {
	return (
		<Dialog.Title
			as="h3"
			className={twMerge(
				'text-lg font-bold leading-6  dark:text-purple-300 transition-colors text-purple-500',
				className
			)}
		>
			{children}
		</Dialog.Title>
	);
}

function ModalDescription({ children, className }: { children: ReactNode; className?: string }) {
	return (
		<Dialog.Description className={twMerge('leading-6 dark:text-gray-200 text-gray-700 text-md', className)}>
			{children}
		</Dialog.Description>
	);
}

export const Modal = Object.assign(ModalGroup, {
	Title: ModalTitle,
	Description: ModalDescription,
});
