import { Send } from 'react-feather';
import { Link, redirect } from 'react-router-dom';
import { FormEvent, Fragment, useState } from 'react';

import { Text } from '../components/elements/Text';
import { Input } from '../components/elements/Input';
import { Button } from '../components/elements/Button';
import { useUser } from '../contexts/user-context/hook';
import { Heading } from '../components/elements/Heading';
import { LoadingSpinning } from '../components/elements/LoadingSpinning';

import { APISignIn } from '../services/api/sign-in';
import { saveUserAsyncDB } from '../services/database/use-cases/save-user';
import { setToken } from '../services/token/handler';

export function SignIn() {
	const [userEmail, setUserEmail] = useState('');
	const [userPassword, setUserPassword] = useState('');

	const [isLoading, setIsLoading] = useState(false);

	const { userDispatch } = useUser();

	async function handleSubmit(event: FormEvent) {
		event.preventDefault();
		setIsLoading(true);

		try {
			const response = await APISignIn({
				email: userEmail,
				password: userPassword,
			});

			setToken(response.access_token);
			userDispatch({ type: 'SET_USER', payload: response.data });

			await saveUserAsyncDB({
				id: response.data.id,
				createdAt: response.data.createdAt,
				email: response.data.email,
				name: response.data.name,
			});

			setIsLoading(false);

			redirect('/');
		} catch (error) {
			setIsLoading(false);
		}
	}

	return (
		<div className="h-screen w-screen flex">
			<aside className="flex flex-[0.60] bg-[url('./src/assets/sign-background.svg')] bg-no-repeat bg-black bg-cover h-screen relative"></aside>

			<main className="flex flex-[0.40] bg-white h-screen p-4 min-w-[30rem] shadow-lg">
				<section className="flex flex-col gap-8 w-full max-w-[30rem] m-auto">
					<header className="flex flex-col gap-3">
						<Heading asChild size="lg">
							<h1>Sign In</h1>
						</Heading>

						<Text asChild size="md">
							<p>
								Don't have an account?{' '}
								<Link to="/sign-up" className="text-red-500 font-semibold">
									Sign Up
								</Link>
							</p>
						</Text>
					</header>

					<form onSubmit={handleSubmit} className="flex flex-col gap-3">
						<Input.Group>
							<Input.Label>E-mail</Input.Label>

							<Input.InputWrapper className="w-full">
								<Input
									placeholder="Type your e-mail"
									type="email"
									value={userEmail}
									onChange={e => setUserEmail(e.target.value)}
								/>
							</Input.InputWrapper>
						</Input.Group>

						<Input.Group>
							<Input.Label>Password</Input.Label>

							<Input.InputWrapper className="w-full">
								<Input
									placeholder="Type your password"
									type="password"
									value={userPassword}
									onChange={e => setUserPassword(e.target.value)}
								/>
							</Input.InputWrapper>
						</Input.Group>

						<Button
							type="submit"
							className="w-full bg-gradient-to-r from-[#1C64CE] border-0 to-[#B809A6]"
							disabled={!(userEmail && userPassword)}
						>
							{isLoading ? (
								<LoadingSpinning color="white" size={24} lineSize={4} />
							) : (
								<Fragment>
									<Send className="text-white text-lg" />
									Sign In
								</Fragment>
							)}
						</Button>
					</form>
				</section>
			</main>
		</div>
	);
}
