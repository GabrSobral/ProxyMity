import { Participant } from '@application/entities/participant';
import { Conversation } from '@application/entities/conversation';

import { Either } from '@helpers/Either';

export interface ParticipantRepository {
  add(participant: Participant): Promise<Either<Error, void>>;
  remove(participant: Participant): Promise<Either<Error, void>>;
  getByConversationId(conversationId: Conversation['_id']): Promise<Either<Error, Participant[]>>;
}
