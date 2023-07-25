import { signOut } from 'next-auth/react';

import { Modal } from '@/@design-system/Modal';
import { Button } from '@/@design-system/Button';

interface Props {
	closeModal: () => void;
	show: boolean;
}

export function LogoutModal({ show, closeModal }: Props) {
	return (
		<Modal show={show} closeModal={closeModal} className="max-w-[420px]">
			<Modal.Title className="text-purple-300">Are you leaving already?..</Modal.Title>
			<Modal.Description>
				If you logout, all your data saved data will be deleted, and you will must to Login again.
			</Modal.Description>

			<div className="flex gap-1 flex-wrap mt-2">
				<Button type="button" onClick={closeModal} isOutlined className="flex-1">
					Cancel
				</Button>

				<Button
					type="button"
					onClick={() => signOut({ callbackUrl: '/auth/sign-in', redirect: true })}
					className="flex-1"
				>
					Logout
				</Button>
			</div>
		</Modal>
	);
}
