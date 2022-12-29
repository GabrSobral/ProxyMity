import { PrismaClient } from '@prisma/client';

import { Message } from '@application/entities/message';
import { MessageRepository } from '@application/repositories/message-repository';

export class PrismaMessageRepository implements MessageRepository {
  constructor(private prisma: PrismaClient) {}

  async create(message: Message): Promise<void> {
    await this.prisma.message.create({
      data: {
        id: message.id,
        content: message.content,
        readAt: message.readAt,
        receivedAt: message.receivedAt,
        sentAt: message.sentAt,
        authorId: message.authorId,
        recipientId: message.recipientId,
      },
    });
  }
}
