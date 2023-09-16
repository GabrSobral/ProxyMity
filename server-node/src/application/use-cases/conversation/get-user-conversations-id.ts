import { Injectable } from '@nestjs/common';

import { User } from '@application/entities/user';
import { Conversation } from '@application/entities/conversation';

import { ParticipantRepository } from '@application/repositories/participant-repository';

import { Either, left, right } from '@helpers/Either';

interface Request {
  userId: User['_id'];
}
interface Response {
  conversationsId: Conversation['_id'][];
}

@Injectable()
export class GetUserConversationsIdUseCase {
  constructor(private readonly participantRepository: ParticipantRepository) {}

  async execute({ userId }: Request): Promise<Either<Error, Response>> {
    const conversationsThatUserParticipate = await this.participantRepository.getByUserId(userId);

    if (conversationsThatUserParticipate.isLeft()) {
      return left(new Error('Error on try to get participants from database'));
    }

    if (conversationsThatUserParticipate.value.length === 0) {
      return left(new Error('No participant was found with this id'));
    }

    const conversationsId = conversationsThatUserParticipate.value.map(item => item.conversationId);

    return right({ conversationsId });
  }
}
