import { signOut } from 'next-auth/react';

import { Modal } from '@/@design-system/Modal';
import { Button } from '@/@design-system/Button';
import { useState } from 'react';
import { LoadingSpinning } from '@/@design-system/LoadingSpinning';

interface Props {
	closeModal: () => void;
	show: boolean;
}

export function LogoutModal({ show, closeModal }: Props) {
	const [isLoading, setIsLoading] = useState(false);

	return (
		<Modal show={show} closeModal={closeModal} className="max-w-[420px]">
			<Modal.Title>Are you leaving already?..</Modal.Title>
			<Modal.Description>
				If you logout, all your data saved data will be deleted, and you will must to Login again.
			</Modal.Description>

			<div className="flex gap-1 flex-wrap mt-2">
				<Button
					type="button"
					onClick={closeModal}
					isOutlined
					className="flex-1"
					disabled={isLoading}
					aria-disabled={isLoading}
				>
					Cancel
				</Button>

				<Button
					type="button"
					onClick={() => {
						setIsLoading(true);
						signOut({ callbackUrl: '/auth/sign-in', redirect: true });
					}}
					className="flex-1"
					disabled={isLoading}
					aria-disabled={isLoading}
				>
					{isLoading ? <LoadingSpinning size={32} lineSize={2} color="white" /> : 'Logout'}
				</Button>
			</div>
		</Modal>
	);
}
