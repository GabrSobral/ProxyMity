import { FormEvent, useState } from 'react';
import { Send } from 'react-feather';
import { Link, redirect } from 'react-router-dom';

import { Button } from '../components/elements/Button';
import { Heading } from '../components/elements/Heading';
import { Input } from '../components/elements/Input';
import { Text } from '../components/elements/Text';

export function SignUp() {
	const [userEmail, setUserEmail] = useState('');
	const [userName, setUserName] = useState('');
	const [userPassword, setUserPassword] = useState('');

	function handleSubmit(event: FormEvent) {
		event.preventDefault();
	}

	return (
		<div className="h-screen w-screen flex">
			<aside className="flex items-center justify-center flex-[0.60] bg-[url('./src/assets/sign-background.svg')] bg-no-repeat bg-black bg-cover h-screen relative"></aside>

			<main className="flex flex-[0.40] bg-white h-screen p-4 min-w-[30rem] shadow-lg">
				<section className="flex flex-col gap-8 w-full max-w-[30rem] m-auto">
					<header className="flex flex-col gap-3">
						<Heading asChild size="lg">
							<h1>Sign Up</h1>
						</Heading>

						<Text asChild size="md">
							<p>
								Already have an account?{' '}
								<Link to="/sign-in" className="text-red-500 font-semibold">
									Sign In
								</Link>
							</p>
						</Text>
					</header>

					<form onSubmit={handleSubmit} className="flex flex-col gap-3">
						<Input.Group>
							<Input.Label>Name</Input.Label>

							<Input.InputWrapper className="w-full">
								<Input
									placeholder="Type your name"
									type="text"
									value={userName}
									onChange={e => setUserName(e.target.value)}
								/>
							</Input.InputWrapper>
						</Input.Group>

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
						>
							<Send className="text-white text-lg" />
							Sign Up
						</Button>
					</form>
				</section>
			</main>
		</div>
	);
}
