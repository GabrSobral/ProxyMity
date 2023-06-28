import { Conversation } from '@application/entities/conversation';
import { Either } from '@helpers/Either';

export interface ConversationRepository {
  create(newConversation: Conversation): Promise<Either<Error, void>>;
  getById(conversationId: Conversation['_id']): Promise<Either<Error, Conversation | null>>;
  disableConversationById(conversationId: Conversation['_id']): Promise<Either<Error, void>>;
}
