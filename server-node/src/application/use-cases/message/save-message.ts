import { Injectable } from '@nestjs/common';

import { Message } from '@application/entities/message';
import { MessageStatus } from '@application/entities/message-status';

import { MessageRepository } from '@application/repositories/message-repository';
import { ParticipantRepository } from '@application/repositories/participant-repository';
import { ConversationRepository } from '@application/repositories/conversation-repository';
import { MessageStatusRepository } from '@application/repositories/message-status-repository';

import { Either, left, right } from '@helpers/Either';

interface Request {
  message: Message;
}

@Injectable()
export class SaveMessageUseCase {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly participantsRepository: ParticipantRepository,
    private readonly conversationRepository: ConversationRepository,
    private readonly messageStatusRepository: MessageStatusRepository,
  ) {}

  async execute({ message }: Request): Promise<Either<Error, void>> {
    const conversation = await this.conversationRepository.getById(message.conversationId);

    if (conversation.isLeft()) {
      return left(new Error(`Error on try to get conversation: ${conversation.value}`));
    }

    if (!conversation.value) {
      return left(new Error(`Error on try to send message. Conversation not found: ${message.conversationId}`));
    }

    const conversationId = conversation.value.id;

    await this.messageRepository.create(message);

    if (conversation.value.isGroup) {
      const participants = await this.participantsRepository.getByConversationId(conversationId);

      if (participants.isLeft()) {
        return left(new Error(`Error on try to get participants: ${participants.value}`));
      }

      await Promise.all(
        participants.value.map(async participant => {
          if (participant.userId !== message.authorId) {
            await this.messageStatusRepository.create(
              MessageStatus.create({
                messageId: message.id,
                userId: participant.userId,
                conversationId,
              }),
            );
          }
        }),
      );
    }

    return right(void 0);
  }
}
