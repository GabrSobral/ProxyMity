import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { SignUpPageComponents } from './components';

export const metadata = {
	title: 'ProxyMity - Sign Up',
	description: 'ProxyMity Login: Register Now',
};

export default async function SignUp() {
	const session = await getServerSession();

	if (session) {
		redirect('/products/chats');
	}

	return <SignUpPageComponents />;
}
