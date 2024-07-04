import { authApi } from '../../../../services/api/config';

interface Request {
   email: string;
}

export async function forgotPasswordSendEmailAsync({ email }: Request): Promise<void> {
   await authApi.post('/auth/forgot-password/send-mail', { email });
}
