import { Contact } from '@application/entities/contact';
import { Message } from '@application/entities/message';
import { MessageRepository } from '@application/repositories/message-repository';

interface SendMessageRequest {
  message: Message;
  recipientId: Contact['_id'];
}

export class SaveMessage {
  constructor(private messageRepository: MessageRepository) {}

  async execute({ message, recipientId }: SendMessageRequest) {
    await this.messageRepository.create(message);

    console.log(this.messageRepository);
  }
}
