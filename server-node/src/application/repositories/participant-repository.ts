import { Injectable } from '@nestjs/common';

import { User } from '@application/entities/user';
import { Group } from '@application/entities/group';
import { Participant } from '@application/entities/participant';
import { Conversation } from '@application/entities/conversation';

import { Either } from '@helpers/Either';

export interface IGetConversationsByUserIdResponse {
  id: Conversation['_id'];
  isGroup: boolean;
  disabledAt: Date | null;
  createdAt: Date;
  groupName: Group['name'] | null;
  groupDescription: Group['description'] | null;
}

export interface IGetParticipantsByConversationIdResponse {
  id: User['_id'];
  name: User['name'];
  email: User['email'];
  lastOnline: User['lastOnline'];
  enteredAt: Participant['createdAt'];
  removedAt: Participant['removedAt'];
}

@Injectable()
export abstract class ParticipantRepository {
  abstract add(participant: Participant): Promise<Either<Error, void>>;
  abstract remove(participant: Participant): Promise<Either<Error, void>>;
  abstract getByUserId(userId: User['_id']): Promise<Either<Error, Participant[]>>;
  abstract getByConversationId(conversationId: Conversation['_id']): Promise<Either<Error, Participant[]>>;
  abstract getConversationsByUserId(userId: User['_id']): Promise<Either<Error, IGetConversationsByUserIdResponse[]>>;
  abstract getParticipantsByConversationId(
    conversationId: Conversation['_id'],
  ): Promise<Either<Error, IGetParticipantsByConversationIdResponse[]>>;
}
