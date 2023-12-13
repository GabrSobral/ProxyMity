'use client';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FormEvent, Fragment, useState } from 'react';
import { Eye, EyeClosed, UserPlus } from '@phosphor-icons/react';

import { Input } from '@/@design-system/Input';
import { Button } from '@/@design-system/Button';
import { LoadingSpinning } from '@/@design-system/LoadingSpinning';

import { WarningAlert } from '../../components/WarningAlert';
import { StrongPasswordModal } from '../../components/StrongPasswordModal';

import { useAuthStore } from '@/app/auth/authStore';

export function SignUpPage() {
	const router = useRouter();

	const [strongPasswordModalVisible, setStrongPasswordModalVisible] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const [error, setError] = useState<string | null>(null);

	const { name, email, password } = useAuthStore(store => store.signUp.states);
	const { setNameValue, setEmailValue, setPasswordValue } = useAuthStore(store => store.signUp.actions);

	async function handleSubmit(event: FormEvent) {
		event.preventDefault();
		setIsLoading(true);

		try {
			const result = await signIn('register', { name, email, password, redirect: false });

			if (result?.error) {
				console.error(result?.error);

				setError(result?.error);
				setIsLoading(false);
				return;
			}

			setIsLoading(false);
			router.replace('/products/chats');
		} catch (error: any) {
			console.log(error?.response?.data || error?.message);
			setError(error?.response?.data.message || error?.message);
			setIsLoading(false);
		}
	}

	return (
		<Fragment>
			{error && <WarningAlert errorMessage={error} closeAlert={() => setError(null)} />}

			<form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
				<Input.Group>
					<Input.Label>Name</Input.Label>
					<Input.Wrapper className="w-full">
						<Input
							type="text"
							name="name"
							placeholder="Type your name"
							title="Type your name"
							autoComplete="name"
							required
							value={name}
							className="bg-gray-900 ring-gray-700 text-gray-200"
							onChange={e => setNameValue(e.target.value)}
						/>
					</Input.Wrapper>
				</Input.Group>

				<Input.Group>
					<Input.Label>E-mail</Input.Label>
					<Input.Wrapper className="w-full">
						<Input
							type="email"
							name="email"
							placeholder="Type your e-mail"
							autoComplete="email"
							title="Type your e-mail"
							required
							value={email}
							className="bg-gray-900 ring-gray-700 text-gray-200"
							onChange={e => setEmailValue(e.target.value)}
						/>
					</Input.Wrapper>
				</Input.Group>

				<Input.Group>
					<Input.Label>Password</Input.Label>
					<Input.Wrapper className="w-full">
						<Input
							type={showPassword ? 'text' : 'password'}
							name="password"
							placeholder="**********"
							value={password}
							autoComplete="new-password"
							title="Type or paste a strong password"
							required
							className="bg-gray-900 ring-gray-700 text-gray-200"
							onChange={e => setPasswordValue(e.target.value)}
						/>

						<button
							type="button"
							aria-label={showPassword ? 'Hide password' : 'Show Password'}
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

				<Button type="submit" className="w-full" title={isLoading ? 'Loading...' : 'Create Account'}>
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
			</form>
		</Fragment>
	);
}
