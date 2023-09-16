import { Injectable } from '@nestjs/common';

import { Conversation } from '@application/entities/conversation';

import { Either } from '@helpers/Either';

@Injectable()
export abstract class ConversationRepository {
  abstract create(newConversation: Conversation): Promise<Either<Error, void>>;
  abstract getById(conversationId: Conversation['_id']): Promise<Either<Error, Conversation | null>>;
  abstract disableConversationById(conversationId: Conversation['_id']): Promise<Either<Error, void>>;
}
