'use client';

import { useEffect, useState } from 'react';
import { ArrowClockwise, Check, Copy, Eye, EyeClosed, Key, Warning } from '@phosphor-icons/react';

import { Modal } from '@/@design-system/Modal';

import { useAuthStore } from '../stores/authStore';

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
		const charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';

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
				A strong and random password helps protect your online accounts and personal information from cyber threats
			</Modal.Description>

			<Modal.Description>
				By using a mix of characters and symbols, you can reduce the risk of unauthorized access and identity theft.
			</Modal.Description>

			<Modal.Description>Protect yourself by choosing a strong password.</Modal.Description>

			<Modal.Description className="dark:text-orange-300 text-orange-400 flex items-center gap-2">
				<Warning size={24} className="dark:text-orange-300 text-orange-400" />
				Don&lsquo;t forget to save this password before create your account!
			</Modal.Description>

			<div className="dark:bg-gray-950 bg-gray-100 p-2 px-4 rounded-[10px] flex items-center justify-between mt-4 shadow-inner">
				<strong className="text-[1.5rem] font-bold tracking-widest dark:text-white text-gray-700">
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
							<EyeClosed size={28} className="dark:text-purple-300 text-purple-500" />
						) : (
							<Eye size={28} className="dark:text-purple-300 text-purple-500" />
						)}
					</button>

					<button
						type="button"
						onClick={generatePassword}
						title="Regenerate the password"
						className="flex items-center justify-center w-fit active:scale-90 transition-all"
					>
						<ArrowClockwise size={28} className="dark:text-purple-300 text-purple-500" />
					</button>
				</div>
			</div>

			<div className="flex gap-2 ml-auto">
				<button
					type="button"
					onClick={copyToClipboard}
					className="p-2 px-3 transition-all flex items-center gap-2 dark:text-purple-300 text-purple-500 tracking-wider text-md rounded-[10px] border-2 border-solid border-purple-500 w-fit"
				>
					{isCopied ? (
						<Check size={28} className="dark:text-purple-300 text-purple-500" />
					) : (
						<Copy size={28} className="dark:text-purple-300 text-purple-500" />
					)}
					{isCopied ? 'Copied' : 'Copy'}
				</button>

				<button
					type="button"
					onClick={() => {
						setPasswordValue(strongPassword);
						closeModal();
					}}
					className="p-2 px-3 flex items-center gap-2 dark:text-green-400 text-green-700 tracking-wider text-md rounded-[10px] border-2 border-solid dark:border-green-400 border-green-700 w-fit"
				>
					<Key size={28} className="dark:text-green-400 text-green-700" />
					Use this password
				</button>
			</div>
		</Modal>
	);
}
