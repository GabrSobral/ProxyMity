import { Injectable } from '@nestjs/common';

import { User } from '@application/entities/user';
import { Message } from '@application/entities/message';

import { MessageRepository } from '@application/repositories/message-repository';
import { MessageStatusRepository } from '@application/repositories/message-status-repository';

import { Either, left, right } from '@helpers/Either';
import { Conversation } from '@application/entities/conversation';

interface Request {
  messageId: Message['_id'];
  isConversationGroup: boolean;
  conversationId: Conversation['id'];
  status: 'received' | 'sent' | 'read';
  userId: User['_id'];
}

@Injectable()
export class UpdateMessageStatusUseCase {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly messageStatusRepository: MessageStatusRepository,
  ) {}

  async execute(props: Request): Promise<Either<Error, void>> {
    if (props.isConversationGroup) {
      return await this.updateGroupMessage(props);
    } else {
      return await this.updatePrivateMessage(props);
    }
  }

  private async updateGroupMessage({
    messageId,
    status,
    userId,
    conversationId,
  }: Request): Promise<Either<Error, void>> {
    const options = {
      sent: async () => {
        await this.messageRepository.updateStatus(messageId, status);
      },
      received: async () => {
        await this.messageStatusRepository.receive({ messageId, userId });

        const result = await this.messageStatusRepository.getMessagesStatusByMessageId(messageId, conversationId);

        if (result.isLeft()) {
          return left(new Error('Database operation error.'));
        }

        const allMessageStatusFromMessage = result.value;
        const allParticipantsReceivedTheMessage = allMessageStatusFromMessage.every(item => item.receivedAt);

        if (allParticipantsReceivedTheMessage) {
          await this.messageRepository.updateStatus(messageId, 'received');
        }
      },
      read: async () => {
        await this.messageStatusRepository.read({ messageId: messageId, userId });

        const result = await this.messageStatusRepository.getMessagesStatusByMessageId(messageId, conversationId);

        if (result.isLeft()) {
          return left(new Error('Database operation error.'));
        }

        const allMessageStatusFromMessage = result.value;
        const allParticipantsReadTheMessage = allMessageStatusFromMessage.every(item => item.readAt);

        if (allParticipantsReadTheMessage) {
          await this.messageRepository.updateStatus(messageId, 'read');
        }
      },
    };

    await options[status]();

    return right(void 0);
  }

  private async updatePrivateMessage({ messageId, status }: Request): Promise<Either<Error, void>> {
    await this.messageRepository.updateStatus(messageId, status);

    return right(void 0);
  }
}
