'use client';

import { Fragment, useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeClosed, UserPlus } from '@phosphor-icons/react';

import { Input } from '@/@design-system/Input';
import { Button } from '@/@design-system/Button';

import { StrongPasswordModal } from './components/StrongPasswordModal';
import { LoadingSpinning } from '@/@design-system/LoadingSpinning';
import { useAuthStore } from '../authStore';

export default function SignUp() {
	const [strongPasswordModalVisible, setStrongPasswordModalVisible] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const { name, email, password } = useAuthStore(store => store.signUp.states);
	const { setNameValue, setEmailValue, setPasswordValue } = useAuthStore(
		store => store.signUp.actions
	);

	return (
		<motion.form
			className="flex flex-col gap-4"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.5 }}
		>
			<Input.Group>
				<Input.Label>Name</Input.Label>
				<Input.Wrapper className="w-full">
					<Input
						type="text"
						placeholder="Type your name"
						value={name}
						onChange={e => setNameValue(e.target.value)}
					/>
				</Input.Wrapper>
			</Input.Group>

			<Input.Group>
				<Input.Label>E-mail</Input.Label>
				<Input.Wrapper className="w-full">
					<Input
						type="email"
						placeholder="Type your e-mail"
						value={email}
						onChange={e => setEmailValue(e.target.value)}
					/>
				</Input.Wrapper>
			</Input.Group>

			<Input.Group>
				<Input.Label>Password</Input.Label>
				<Input.Wrapper className="w-full">
					<Input
						type={showPassword ? 'text' : 'password'}
						placeholder="**********"
						value={password}
						onChange={e => setPasswordValue(e.target.value)}
					/>

					<button
						type="button"
						onClick={() => setShowPassword(s => !s)}
						className="absolute right-4 -translate-y-2/4 top-2/4"
						title={showPassword ? 'Hide password' : 'Show Password'}
					>
						{showPassword ? (
							<EyeClosed className="text-gray-200" size={24} />
						) : (
							<Eye className="text-gray-200" size={24} />
						)}
					</button>
				</Input.Wrapper>

				<button
					type="button"
					className="text-purple-300 text-sm hover:underline underline-offset-2"
					onClick={() => setStrongPasswordModalVisible(true)}
				>
					Generate a strong password
				</button>
			</Input.Group>

			<Button type="submit" className="w-full">
				{isLoading ? (
					<LoadingSpinning size={32} lineSize={2} color="white" />
				) : (
					<Fragment>
						<UserPlus size={32} className="text-white" weight="light" />
						Create Account
					</Fragment>
				)}
			</Button>

			<StrongPasswordModal
				closeModal={() => setStrongPasswordModalVisible(false)}
				isVisible={strongPasswordModalVisible}
			/>
		</motion.form>
	);
}
