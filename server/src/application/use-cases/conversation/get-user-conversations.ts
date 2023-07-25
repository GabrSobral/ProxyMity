import { Injectable } from '@nestjs/common';

import { User } from '@application/entities/user';
import {
  IGetConversationsByUserIdResponse,
  IGetParticipantsByConversationIdResponse,
  ParticipantRepository,
} from '@application/repositories/participant-repository';

import { Either, left, right } from '@helpers/Either';

interface Request {
  userId: User['_id'];
}
interface Response extends IGetConversationsByUserIdResponse {
  participants: IGetParticipantsByConversationIdResponse[];
}

@Injectable()
export class GetUserConversationsUseCase {
  constructor(private readonly participantRepository: ParticipantRepository) {}

  async execute({ userId }: Request): Promise<Either<Error, Response[]>> {
    const conversationsThatUserParticipate = await this.participantRepository.getConversationsByUserId(userId);

    if (conversationsThatUserParticipate.isLeft()) {
      return left(new Error('Error on try to get conversations from database'));
    }

    const conversations = await Promise.all(
      conversationsThatUserParticipate.value.map(async item => {
        const participants = await this.participantRepository.getParticipantsByConversationId(item.id);

        return {
          ...item,
          participants: participants.isRight() ? participants.value : [],
        };
      }),
    );

    return right(conversations);
  }
}
