import { database } from '../../../../../services/database/db';

import type { User } from '../../../../../types/user';
import type { ILocalMessage } from '../../../../../types/message';
import type { IConversationAPI } from '../../../../../services/api/get-user-conversations';

import { DbOperations } from './DbOperations';
import type { IReadContactMessagesParams, WorkerMethods } from './method-types';

export type Command =
   | { type: WorkerMethods.ADD_MESSAGE; payload: { message: ILocalMessage } }
   | { type: WorkerMethods.GET_CURRENT_USER; payload?: undefined }
   | { type: WorkerMethods.GET_MESSAGE_BY_ID; payload: { messageId: ILocalMessage['id'] } }
   | { type: WorkerMethods.CHANGE_MESSAGE_STATUS; payload: { messageId: ILocalMessage['id'] } }
   | { type: WorkerMethods.READ_CONVERSATION_MESSAGES; payload: IReadContactMessagesParams }
   | { type: WorkerMethods.SAVE_CONVERSATIONS; payload: IConversationAPI[] }
   | { type: WorkerMethods.SAVE_USER; payload: User };

self.onmessage = async ({ data }: { data: Command }) => {
   const operations = new DbOperations(database);
   const response = await operations[data.type](data?.payload);

   console.log('⚙️ Database Worker thread:', { response });

   self.postMessage(response);
};
