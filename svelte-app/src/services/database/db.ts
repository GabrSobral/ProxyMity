import Dexie from 'dexie';
import type { Table } from 'dexie';

import type { User } from '../../types/user';
import type { Message } from '../../types/message';
import type { Conversation } from '../../types/conversation';

export class DexieDatabase extends Dexie {
   conversations!: Table<Conversation>;
   me!: Table<User>;
   user!: Table<User>;
   messages!: Table<Message>;

   constructor() {
      super('proxymity-chats');
      this.version(1).stores({
         me: `
				id,
				name, 
				email, 
				
				createdAt,
				photoUrl
			`,
         users: `
				id,
				name, 
				email, 
				
				createdAt,
				photoUrl
			`,
         conversations: `
				id,
				isGroup,
				order,

        		createdAt,
				groupName,
				groupDescription,
				participants
      		`,
         messages: `
				++dbId,
				id,
				content,
		
				writtenAt,
				sentAt,
				receivedByAllAt,
				readByAllAt,
			
				conversationId,
				repliedMessage,
				authorId,

				[contactRef+readAt+authorId]
			`,
      });
   }
}

export const database = new DexieDatabase();
