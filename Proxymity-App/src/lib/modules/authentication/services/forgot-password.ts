import { authApi } from '../../../../services/api/config';

interface Request {
   passwordResetToken: string;
   passwordResetId: string;
   newPassword: string;
}

export async function forgotPasswordAsync({ newPassword, passwordResetId, passwordResetToken }: Request): Promise<void> {
   await authApi.post('/auth/forgot-password', { newPassword, passwordResetId, passwordResetToken });
}
