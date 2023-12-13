import { Header } from '@/@application/Header';
import { WebSocketProvider } from '@/@modules/chat/contexts/websocket-context/context';

import { verifyServerSessionAsync } from '@/types/verifyServerSessionAsync';

export default async function ProductsLayout({ children }: { children: React.ReactNode }) {
	await verifyServerSessionAsync({ callbackUrl: '/auth/sign-in', shouldInvertVerification: true });

	return (
		<WebSocketProvider>
			<Header />
			{children}
		</WebSocketProvider>
	);
}
