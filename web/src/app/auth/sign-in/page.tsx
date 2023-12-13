import { SignInPage } from '@/@modules/authentication/pages/sign-in/page';
import { verifyServerSessionAsync } from '@/types/verifyServerSessionAsync';

export const metadata = {
	title: 'ProxyMity - Sign In',
	description: 'ProxyMity Login: Connect Now',
};

export default async function SignIn() {
	await verifyServerSessionAsync({ callbackUrl: '/products/chat' });

	return <SignInPage />;
}
