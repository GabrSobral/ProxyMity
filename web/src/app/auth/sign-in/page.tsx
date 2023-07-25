import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { SignInPageComponents } from './components';

export const metadata = {
	title: 'ProxyMity - Sign In',
	description: 'ProxyMity Login: Connect Now',
};

export default async function SignIn() {
	const session = await getServerSession();

	if (session) {
		redirect('/products/chats');
	}

	return <SignInPageComponents />;
}
