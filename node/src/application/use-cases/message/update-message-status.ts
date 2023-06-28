import { User } from '@application/entities/user';
import { Message } from '@application/entities/message';
import { MessageStatus } from '@application/entities/message-status';

import { MessageRepository } from '@application/repositories/message-repository';
import { MessageStatusRepository } from '@application/repositories/message-status-repository';

import { Either, right } from '@helpers/Either';

interface Request {
  message: Message;
  conversationIsGroup: boolean;
  status: 'received' | 'sent';
  userId: User['_id'];
}

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
    const messageStatus = MessageStatus.create({ messageId: message.id, userId });

    const options = {
      sent: async () => {
        message.send();
        await this.messageRepository.updateStatus(message.id, status);
      },
      received: async () => {
        message.receive();
        await this.messageStatusRepository.receive(messageStatus);
      },
    };

    await options[status]();

    return right(message);
  }

  private async updatePrivateMessage({ message, status }: Request): Promise<Either<Error, Message>> {
    const options = {
      sent: () => message.send(),
      received: () => message.receive(),
    };

    options[status]();

    await this.messageRepository.updateStatus(message.id, status);

    return right(message);
  }
}
