import { database } from '../db';
import type { Conversation } from '../../../types/conversation';

interface ReadContactMessagesParams {
   conversationId: Conversation['id'];
   whoRead: string;
   myId: string;
   isConversationGroup: boolean;
}

export async function readConversationMessagesAsyncDB({
   conversationId,
   myId,
   whoRead,
   isConversationGroup,
}: ReadContactMessagesParams): Promise<void> {
   await database.messages
      .where({ conversationId })
      .and(item => item.authorId !== whoRead)
      .and(item => item.readByAllAt === null)
      .modify({ readByAllAt: new Date() });
}
