import { Socket } from 'socket.io';

import { Contact } from '@application/entities/contact';
import { Message } from '@application/entities/message';
import { MessageRepository } from '@application/repositories/message-repository';

interface SendMessageRequest {
  message: Message;
  recipientId: Contact['_id'];
}

export class SendMessage {
  constructor(
    private messageRepository: MessageRepository,
    private webSocket: Socket,
  ) {}

  async execute({ message, recipientId }: SendMessageRequest) {
    this.webSocket.to(recipientId).emit('receive_message', { message });

    // await this.messageRepository.create(message);

    console.log(this.messageRepository);
  }
}
