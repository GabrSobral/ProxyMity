import { chatApi } from '../../../../services/api/config';
import type { IServiceOptions } from '../../../../types/utils/IServiceOptions';

interface Request {
   name: string;
   description: string;
   participants: string[];
}

interface Response {
   id: string;
   name: string;
   email: string;
   photoUrl: string;
   createdAt: Date;
}

export async function createGroupConversationAsync(
   { name, description, participants }: Request,
   { accessToken }: IServiceOptions
): Promise<Response> {
   const { data } = await chatApi.post<Response>(
      '/conversations/group',
      {
         name,
         description,
         participants,
      },
      {
         headers: {
            Authorization: `Bearer ${accessToken}`,
         },
      }
   );

   return data;
}
