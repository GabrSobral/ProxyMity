import { Injectable } from '@nestjs/common';

import { User } from '@application/entities/user';
import { Message } from '@application/entities/message';

import { MessageRepository } from '@application/repositories/message-repository';
import { MessageStatusRepository } from '@application/repositories/message-status-repository';

import { Either, left, right } from '@helpers/Either';

interface Request {
  message: Message;
  conversationIsGroup: boolean;
  status: 'received' | 'sent' | 'read';
  userId: User['_id'];
}

@Injectable()
export class UpdateMessageStatusUseCase {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly messageStatusRepository: MessageStatusRepository,
  ) {}

  async execute(props: Request): Promise<Either<Error, Message>> {
    if (props.conversationIsGroup) {
      return await this.updateGroupMessage(props);
    } else {
      return await this.updatePrivateMessage(props);
    }
  }

  private async updateGroupMessage({ message, status, userId }: Request): Promise<Either<Error, Message>> {
    const options = {
      sent: async () => {
        message.send();
        await this.messageRepository.updateStatus(message.id, status);
      },
      received: async () => {
        message.receive();
        await this.messageStatusRepository.receive({ messageId: message.id, userId });

        const result = await this.messageStatusRepository.getUnreceivedMessagesStatusByUserId(
          userId,
          message.conversationId,
        );

        if (result.isLeft()) {
          return left(new Error('Database operation error.'));
        }

        const messagesStatus = result.value;
        const allParticipantsReceivedTheMessage = messagesStatus.every(item => item.receivedAt);

        if (allParticipantsReceivedTheMessage) {
          await this.messageRepository.updateStatus(message.id, 'received');
        }
      },
      read: async () => {
        message.read();
        await this.messageStatusRepository.read({ messageId: message.id, userId });

        const result = await this.messageStatusRepository.getUnreadMessagesStatusByUserId(
          userId,
          message.conversationId,
        );

        if (result.isLeft()) {
          return left(new Error('Database operation error.'));
        }

        const messagesStatus = result.value;
        const allParticipantsReadTheMessage = messagesStatus.every(item => item.readAt);

        if (allParticipantsReadTheMessage) {
          await this.messageRepository.updateStatus(message.id, 'read');
        }
      },
    };

    await options[status]();

    return right(message);
  }

  private async updatePrivateMessage({ message, status }: Request): Promise<Either<Error, Message>> {
    const options = {
      sent: () => message.send(),
      received: () => message.receive(),
      read: () => message.read(),
    };

    options[status]();

    await this.messageRepository.updateStatus(message.id, status);

    return right(message);
  }
}
