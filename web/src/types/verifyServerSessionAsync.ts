import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { nextAuthOptions } from '@/app/api/auth/[...nextauth]/options';

interface IConfig {
	callbackUrl: string;
	shouldInvertVerification?: boolean;
}

export async function verifyServerSessionAsync({ callbackUrl, shouldInvertVerification }: IConfig) {
	const session = await getServerSession(nextAuthOptions);

	if (shouldInvertVerification) {
		if (!session || JSON.stringify(session) === '{}') {
			redirect(callbackUrl);
		}
	} else {
		if (session) {
			redirect(callbackUrl);
		}
	}
}
