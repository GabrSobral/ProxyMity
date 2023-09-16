import { Injectable, Logger } from '@nestjs/common';

import { User } from '@application/entities/user';
import { Message } from '@application/entities/message';

import {
  IGetConversationsByUserIdResponse,
  IGetParticipantsByConversationIdResponse,
  ParticipantRepository,
} from '@application/repositories/participant-repository';
import { MessageRepository } from '@application/repositories/message-repository';
import { MessageStatusRepository } from '@application/repositories/message-status-repository';

import { Either, left, right } from '@helpers/Either';
import { IMessageViewModel } from '@infra/http/view-model/message-view-model';

interface Request {
  userId: User['_id'];
}

interface Response extends IGetConversationsByUserIdResponse {
  participants: IGetParticipantsByConversationIdResponse[];
  lastMessages: IMessageViewModel[];
  unreadMessagesCount: number;
}

@Injectable()
export class GetUserConversationsUseCase {
  constructor(
    private readonly participantRepository: ParticipantRepository,
    private readonly messageRepository: MessageRepository,
    private readonly messageStatusRepository: MessageStatusRepository,
  ) {}

  async execute({ userId }: Request): Promise<Either<Error, Response[]>> {
    const conversationsThatUserParticipate = await this.participantRepository.getConversationsByUserId(userId);

    if (conversationsThatUserParticipate.isLeft()) {
      return left(new Error('Error on try to get conversations from database'));
    }

    const conversations = await Promise.all(
      conversationsThatUserParticipate.value.map(async conversation => {
        const [participants, lastMessages, unreadMessagesCount] = await Promise.all([
          await this.participantRepository.getParticipantsByConversationId(conversation.id),
          await this.messageRepository.getMessagesFromConversation(conversation.id, 3),

          conversation.isGroup
            ? await this.messageStatusRepository.getUnreadMessagesStatusCountByUserId(userId, conversation.id) // Group Conversation
            : await this.messageRepository.getUnreadConversationMessagesCount(userId, conversation.id), // Private Conversation
        ]);

        if (participants.isLeft()) Logger.error(`Conversation: ${conversation.id}`, participants.value);
        if (lastMessages.isLeft()) Logger.error(`Conversation: ${conversation.id}`, lastMessages.value);

        return {
          ...conversation,
          unreadMessagesCount: unreadMessagesCount?.isRight() ? unreadMessagesCount.value : 0,
          participants: participants.isRight() ? participants.value : [],
          lastMessages: lastMessages.isRight() ? lastMessages.value : [],
        };
      }),
    );

    return right(conversations);
  }
}
