import { Header } from './chats/components/Header';
import { WebSocketProvider } from './chats/contexts/websocket-context/context';

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
	return (
		<WebSocketProvider>
			<Header />
			{children}
		</WebSocketProvider>
	);
}
