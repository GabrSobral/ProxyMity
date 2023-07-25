import '../style/globals.css';
import { Inter } from 'next/font/google';

import { AuthWrapperProvider } from '@/contexts/auth-context/context';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
	title: 'ProxyMity',
	description: 'Generated by create next app',
	icons: {
		icon: '/favicon.svg',
	},
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="pt-br">
			<body className="w-screen h-screen flex flex-col bg-gray-800" style={inter.style}>
				<AuthWrapperProvider>{children}</AuthWrapperProvider>
			</body>
		</html>
	);
}
