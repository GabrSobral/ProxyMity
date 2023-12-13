import { SignUpPage } from '@/@modules/authentication/pages/sign-up/page';
import { verifyServerSessionAsync } from '@/types/verifyServerSessionAsync';

export const metadata = {
	title: 'ProxyMity - Sign Up',
	description: 'ProxyMity Login: Register Now',
};

export default async function SignUp() {
	await verifyServerSessionAsync({ callbackUrl: '/products/chat' });

	return <SignUpPage />;
}
