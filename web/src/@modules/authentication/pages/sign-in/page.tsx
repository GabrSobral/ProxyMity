'use client';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FormEvent, Fragment, useState } from 'react';
import { Eye, EyeClosed, SignIn as SignInIcon } from '@phosphor-icons/react';

import { Input } from '@/@design-system/Input';
import { Button } from '@/@design-system/Button';
import { LoadingSpinning } from '@/@design-system/LoadingSpinning';

import { useAuthStore } from '../../stores/authStore';

import { WarningAlert } from '../../components/WarningAlert';

export function SignInPage() {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const { email, password } = useAuthStore(store => store.signIn.states);
	const { setEmailValue, setPasswordValue } = useAuthStore(store => store.signIn.actions);

	async function handleSubmit(event: FormEvent) {
		event.preventDefault();
		setIsLoading(true);

		const result = await signIn('credentials', { email, password, redirect: false, cmd: 'sign-in' });

		if (result?.error) {
			console.error(result?.error);

			setError(result?.error);
			setIsLoading(false);
			return;
		}

		setIsLoading(false);
		router.replace('/products/chats');
	}

	return (
		<Fragment>
			{error && <WarningAlert errorMessage={error} closeAlert={() => setError(null)} />}

			<form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
				<Input.Group>
					<Input.Label>E-mail</Input.Label>
					<Input.Wrapper className="w-full">
						<Input
							type="email"
							name="email"
							placeholder="Type your e-mail"
							autoComplete="email"
							title="Type your e-mail"
							value={email}
							required
							onChange={e => setEmailValue(e.target.value)}
							className="bg-gray-900 ring-gray-700 text-gray-200"
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
							autoComplete="current-password"
							title="Type your password"
							value={password}
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
				</Input.Group>

				<Button
					type="submit"
					className="w-full"
					disabled={!(email && password) || isLoading}
					title={isLoading ? 'Loading...' : 'Sign In'}
				>
					{isLoading ? (
						<LoadingSpinning size={32} lineSize={2} color="white" />
					) : (
						<Fragment>
							<SignInIcon size={32} className="text-white" weight="light" />
							Sign In
						</Fragment>
					)}
				</Button>
			</form>
		</Fragment>
	);
}
