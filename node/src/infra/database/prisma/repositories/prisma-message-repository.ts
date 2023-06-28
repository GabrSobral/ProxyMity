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
        conversationId: message.conversationId,
        repliedMessageId: message.repliedMessageId,
        receivedAt: message.receivedAt,
        sentAt: message.sentAt,
        authorId: message.authorId,
      },
    });
  }

  async updateStatus(messageId: string, status: 'read' | 'received'): Promise<void> {
    const options = {
      read: async () => await this.prisma.message.update({ where: { id: messageId }, data: { readAt: new Date() } }),
      received: async () =>
        await this.prisma.message.update({ where: { id: messageId }, data: { receivedAt: new Date() } }),
    };

    await options[status]();
  }

  async getUnreadConversationMessages(conversationId: string): Promise<Message[]> {
      const unreadMessages = await this.prisma.
  }
}
