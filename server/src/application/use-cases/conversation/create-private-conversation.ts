import { Injectable } from '@nestjs/common';

import { User } from '@application/entities/user';
import { Participant } from '@application/entities/participant';
import { Conversation } from '@application/entities/conversation';

import { ParticipantRepository } from '@application/repositories/participant-repository';
import { ConversationRepository } from '@application/repositories/conversation-repository';

import { Either, left, right } from '@helpers/Either';

interface Request {
  participants: User['_id'][];
}

interface Response {
  conversation: Conversation;
  participants: Participant[];
}

@Injectable()
export class CreatePrivateConversationUseCase {
  constructor(
    private readonly participantRepository: ParticipantRepository,
    private readonly conversationRepository: ConversationRepository,
  ) {}

  async execute({ participants }: Request): Promise<Either<Error, Response>> {
    const conversation = Conversation.create({
      isGroup: false,
      createdAt: new Date(),
    });

    if (participants.length !== 2)
      return left(new Error('Private conversation cannot be created with a number of participants different than 2.'));

    await this.conversationRepository.create(conversation);

    const participantsArray: Participant[] = [];

    await Promise.all(
      participants.map(async participantId => {
        const participant = Participant.create({ userId: participantId, conversationId: conversation.id });
        participantsArray.push(participant);

        await this.participantRepository.add(participant);
      }),
    );

    return right({
      conversation,
      participants: participantsArray,
    });
  }
}
