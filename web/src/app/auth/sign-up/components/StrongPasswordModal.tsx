import { useEffect, useState } from 'react';
import { ArrowClockwise, Check, Copy, Eye, EyeClosed, Key, Warning } from '@phosphor-icons/react';

import { Modal } from '@/@design-system/Modal';
import { useAuthStore } from '../../authStore';

interface Props {
	isVisible: boolean;
	closeModal: () => void;
}

export function StrongPasswordModal({ isVisible, closeModal }: Props) {
	const [strongPassword, setStrongPassword] = useState('');
	const [isPasswordVisible, setIsPasswordVisible] = useState(false);
	const [isCopied, setIsCopied] = useState(false);

	const { setPasswordValue } = useAuthStore(store => store.signUp.actions);

	function generatePassword() {
		const passwordLength = 18;
		const charSet =
			'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';

		let password = '';
		for (let i = 0; i < passwordLength; i++) {
			const randomIndex = Math.floor(Math.random() * charSet.length);
			password += charSet[randomIndex];
		}

		setStrongPassword(password);
	}

	useEffect(() => {
		if (isVisible) {
			generatePassword();
			setIsPasswordVisible(false);
		}
	}, [isVisible]);

	function copyToClipboard() {
		navigator.clipboard.writeText(strongPassword);
		setIsCopied(true);

		setTimeout(() => {
			setIsCopied(false);
		}, 1000);
	}

	return (
		<Modal show={isVisible} closeModal={closeModal} className="gap-3 max-w-[36rem]">
			<Modal.Title>Generate a strong password</Modal.Title>
			<Modal.Description className="break-words">
				A strong and random password helps protect your online accounts and personal information
				from cyber threats
			</Modal.Description>

			<Modal.Description>
				By using a mix of characters and symbols, you can reduce the risk of unauthorized access and
				identity theft.
			</Modal.Description>

			<Modal.Description>Protect yourself by choosing a strong password.</Modal.Description>

			<Modal.Description className="text-orange-300 flex items-center gap-2">
				<Warning size={24} className="text-orange-300" />
				Don't forget to save this password before create your account!
			</Modal.Description>

			<div className="bg-gray-950 p-2 px-4 rounded-[10px] flex items-center justify-between mt-4 shadow-inner">
				<strong className="text-[1.5rem] font-bold tracking-widest text-white">
					{isPasswordVisible
						? strongPassword
						: strongPassword
								.split('')
								.map(() => '*')
								.join('')}
				</strong>

				<div className="flex items-center gap-3 ">
					<button
						type="button"
						onClick={() => setIsPasswordVisible(s => !s)}
						title="Show password"
						className="flex items-center justify-center w-fit"
					>
						{isPasswordVisible ? (
							<EyeClosed size={28} className="text-purple-300" />
						) : (
							<Eye size={28} className="text-purple-300" />
						)}
					</button>

					<button
						type="button"
						onClick={generatePassword}
						title="Regenerate the password"
						className="flex items-center justify-center w-fit active:scale-90 transition-all"
					>
						<ArrowClockwise size={28} className="text-purple-300" />
					</button>
				</div>
			</div>

			<div className="flex gap-2 ml-auto">
				<button
					type="button"
					onClick={copyToClipboard}
					className="p-2 px-3 transition-all flex items-center gap-2 text-purple-300 tracking-wider text-md rounded-[10px] border border-solid border-purple-500 w-fit"
				>
					{isCopied ? (
						<Check size={28} className="text-purple-300" />
					) : (
						<Copy size={28} className="text-purple-300" />
					)}
					{isCopied ? 'Copied' : 'Copy'}
				</button>

				<button
					type="button"
					onClick={() => {
						setPasswordValue(strongPassword);
						closeModal();
					}}
					className="p-2 px-3 flex items-center gap-2 text-green-400 tracking-wider text-md rounded-[10px] border border-solid border-green-400 w-fit"
				>
					<Key size={28} className="text-green-400" />
					Use this password
				</button>
			</div>
		</Modal>
	);
}
