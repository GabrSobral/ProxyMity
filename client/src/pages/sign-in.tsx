import { FormEvent, useLayoutEffect, useState } from 'react';
import { Send } from 'react-feather';
import { Link, useNavigate } from 'react-router-dom';

import { Button } from '../components/elements/Button';
import { Heading } from '../components/elements/Heading';
import { Input } from '../components/elements/Input';
import { Text } from '../components/elements/Text';
import { useUser } from '../contexts/user-context/reducers/hook';
import { APISignIn } from '../services/api/sign-in';
import { saveUserAsyncDB } from '../services/database/use-cases/save-user';

export function SignIn() {
	const [userEmail, setUserEmail] = useState('');
	const [userPassword, setUserPassword] = useState('');

	const { userDispatch } = useUser();
	const navigate = useNavigate();

	useLayoutEffect(() => {
		const access_token = localStorage.getItem('@RealChat_access_token');

		if (access_token) navigate('/');
	}, []);

	async function handleSubmit(event: FormEvent) {
		event.preventDefault();

		const response = await APISignIn({
			email: userEmail,
			password: userPassword,
		});

		localStorage.setItem('@RealChat_access_token', response.access_token);
		userDispatch({ type: 'SET_USER', payload: response.data });

		await saveUserAsyncDB({
			id: response.data.id,
			createdAt: response.data.createdAt,
			email: response.data.email,
			name: response.data.name,
		});

		navigate('/');
	}

	return (
		<div className="h-screen w-screen flex">
			<aside className="flex flex-[0.55] bg-blue-500 h-screen"></aside>

			<main className="flex flex-[0.45] bg-white h-screen p-4">
				<section className="flex flex-col gap-8 w-full max-w-[30rem] m-auto">
					<header className="flex flex-col gap-3">
						<Heading
							asChild
							size="lg"
						>
							<h1>Sign in</h1>
						</Heading>

						<Text
							asChild
							size="md"
						>
							<p>
								Don't have an account?{' '}
								<Link
									to="/sign-up"
									className="text-red-500 font-semibold"
								>
									Sign Up
								</Link>
							</p>
						</Text>
					</header>

					<form
						onSubmit={handleSubmit}
						className="flex flex-col gap-3"
					>
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
							className="w-full"
						>
							<Send className="text-white text-lg" />
							Sign In
						</Button>
					</form>
				</section>
			</main>
		</div>
	);
}
