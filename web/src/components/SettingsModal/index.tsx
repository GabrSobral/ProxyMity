import { Modal } from '@/@design-system/Modal';

import { SideBar } from './SideBar';
import { X } from '@phosphor-icons/react';
import { Appearance } from './Appearance';

interface SettingsModalProps {
	show: boolean;
	closeModal: () => void;
}

export function SettingsModal({ closeModal, show }: SettingsModalProps) {
	return (
		<Modal
			show={show}
			closeModal={closeModal}
			className="rounded-[1rem] p-2 w-full h-full max-h-[768px] max-w-[1368px] flex-row bg-gray-100 relative"
			showCloseButton={false}
		>
			<SideBar />
			<Appearance />

			<button
				type="button"
				title="Close"
				onClick={closeModal}
				aria-label="Close settings modal"
				className="rounded-full p-2 absolute top-4 right-4 hover:brightness-150 transition-all dark:bg-gray-900 bg-gray-100"
			>
				<X size={24} className="dark:text-white text-gray-700" />
			</button>
		</Modal>
	);
}
