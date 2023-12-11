import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma.service';

import { User } from '@application/entities/user';
import { Message } from '@application/entities/message';
import { Conversation } from '@application/entities/conversation';
import { MessageRepository } from '@application/repositories/message-repository';

import { Either, left, right } from '@helpers/Either';
import { IMessageViewModel, MessageViewModel } from '@infra/http/view-model/message-view-model';
import { PrismaMessageMapper } from '../mappers/prisma-message.mapper';

@Injectable()
export class PrismaMessageRepository implements MessageRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(message: Message): Promise<Either<Error, void>> {
    try {
      await this.prisma.message.create({
        data: {
          id: message.id,
          content: message.content,
          read_at: message.readAt,
          conversation_id: message.conversationId,
          replied_message_id: message.repliedMessageId,
          received_at: message.receivedAt,
          sent_at: message.sentAt,
          author_id: message.authorId,
          written_at: message.writtenAt,
        },
      });

      return right(void 0);
    } catch (error: any) {
      return left(error);
    }
  }

  async getUnreadConversationMessagesCount(userId: User['_id'], conversationId: Conversation['_id']): Promise<Either<Error, number>> {
    const unreadMessagesCount = await this.prisma.message.count({
      where: { conversation_id: conversationId, NOT: { author_id: userId } },
    });

    return right(unreadMessagesCount);
  }

  async readUnreadMessageByConversationId(userId: string, conversationId: string): Promise<Either<Error, void>> {
    await this.prisma.message.updateMany({
      data: { read_at: new Date() },
      where: { conversation_id: conversationId },
    });

    return right(void 0);
  }

  async updateStatus(messageId: string, status: 'read' | 'received'): Promise<Either<Error, void>> {
    try {
      const options = {
        read: async () => await this.prisma.message.update({ where: { id: messageId }, data: { read_at: new Date() } }),
        received: async () =>
          await this.prisma.message.update({
            data: { received_at: new Date() },
            where: { id: messageId },
          }),
      };

      await options[status]();

      return right(void 0);
    } catch (error: any) {
      return left(error);
    }
  }

  async getMessagesFromConversation(conversationId: string, quantity: number): Promise<Either<Error, IMessageViewModel[]>> {
    const messages = await this.prisma.message.findMany({
      where: { conversation_id: conversationId },
      orderBy: { written_at: 'desc' },
      take: quantity,
    });

    return right(messages.reverse().map(message => MessageViewModel.prismaToViewModel(message)));
  }
}
