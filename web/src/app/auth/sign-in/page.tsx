'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { FormEvent, Fragment, useState } from 'react';
import { Eye, EyeClosed, SignIn as SignInIcon, Warning, X } from '@phosphor-icons/react';

import { Input } from '@/@design-system/Input';
import { Button } from '@/@design-system/Button';
import { LoadingSpinning } from '@/@design-system/LoadingSpinning';

import { useAuthStore } from '../authStore';
import { useUserStore } from '@/stores/user';

import { APISignIn } from '@/services/api/sign-in';
import { setToken } from '@/services/token/handler';
import { saveUserAsyncDB } from '@/services/database/use-cases/save-user';

export const metadata = {
	title: 'ProxyMity - Sign In',
	description: '',
	icons: {
		icon: '/favicon.svg',
	},
};

export default function SignIn() {
	const router = useRouter();

	const [isLoading, setIsLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const setUser = useUserStore(store => store.actions.setUser);

	const { email, password } = useAuthStore(store => store.signIn.states);
	const { setEmailValue, setPasswordValue } = useAuthStore(store => store.signIn.actions);

	async function handleSubmit(event: FormEvent) {
		event.preventDefault();
		setIsLoading(true);

		try {
			const response = await APISignIn({ email, password });

			setToken(response.access_token);
			setUser(response.data);

			await saveUserAsyncDB({
				id: response.data.id,
				createdAt: response.data.createdAt,
				email: response.data.email,
				name: response.data.name,
				photoUrl: response.data?.photoUrl || '',
			});

			setIsLoading(false);

			router.replace('/products/chats');
		} catch (error: any) {
			console.log(error?.response?.data || error?.message);
			if (String(error?.message).includes('Key already exists in the object store')) {
				setError('Error on try to store your data at Indexed DB');
			} else {
				setError(error?.response?.data.message || error?.message);
			}
			setIsLoading(false);
		}
	}

	return (
		<Fragment>
			{error && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					className="w-full border border-solid border-red-500 p-2 px-3 rounded-[10px] mb-3 flex gap-2"
				>
					<Warning size={24} className="text-red-500 " />

					<span className="tracking-wide text-red-500">{error}</span>

					<button type="button" onClick={() => setError(null)} className="ml-auto">
						<X size={24} className="text-white" />
					</button>
				</motion.div>
			)}

			<motion.form
				onSubmit={handleSubmit}
				className="flex flex-col gap-4 w-full"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				transition={{ duration: 0.5 }}
			>
				<Input.Group>
					<Input.Label>E-mail</Input.Label>
					<Input.Wrapper className="w-full">
						<Input
							type="text"
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
				</Input.Group>

				<Button type="submit" className="w-full" disabled={!(email && password)}>
					{isLoading ? (
						<LoadingSpinning size={32} lineSize={2} color="white" />
					) : (
						<Fragment>
							<SignInIcon size={32} className="text-white" weight="light" />
							Sign In
						</Fragment>
					)}
				</Button>
			</motion.form>
		</Fragment>
	);
}
