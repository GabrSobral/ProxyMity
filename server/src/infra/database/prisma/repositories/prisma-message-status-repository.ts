import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma.service';

import { MessageStatus } from '@application/entities/message-status';
import { MessageStatusRepository } from '@application/repositories/message-status-repository';

import { PrismaMessageStatusMapper } from '../mappers/prisma-message.mapper';

import { Either, right } from '@helpers/Either';

@Injectable()
export class PrismaMessageStatusRepository implements MessageStatusRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(messageStatus: MessageStatus): Promise<Either<Error, void>> {
    await this.prisma.messageStatus.create({
      data: {
        conversation_id: messageStatus.conversationId,
        message_id: messageStatus.messageId,
        user_id: messageStatus.userId,
        read_at: messageStatus.readAt,
        received_at: messageStatus.receivedAt,
      },
    });

    return right(void 0);
  }

  async getUnreadMessagesStatusByUserId(
    userId: string,
    conversationId: string,
  ): Promise<Either<Error, MessageStatus[]>> {
    const unreadMessages = await this.prisma.messageStatus.findMany({
      where: {
        user_id: userId,
        conversation_id: conversationId,
        AND: {
          read_at: null,
        },
      },
    });

    return right(unreadMessages.map(PrismaMessageStatusMapper.toDomain));
  }

  async getUnreceivedMessagesStatusByUserId(
    userId: string,
    conversationId: string,
  ): Promise<Either<Error, MessageStatus[]>> {
    const unreceivedMessages = await this.prisma.messageStatus.findMany({
      where: {
        user_id: userId,
        conversation_id: conversationId,
        AND: {
          received_at: null,
        },
      },
    });

    return right(unreceivedMessages.map(PrismaMessageStatusMapper.toDomain));
  }

  async read(props: { userId: string; messageId: string }): Promise<Either<Error, void>> {
    const { messageId, userId } = props;

    await this.prisma.messageStatus.updateMany({
      data: {
        read_at: new Date(),
      },
      where: {
        message_id: messageId,
        user_id: userId,
      },
    });

    return right(void 0);
  }

  async receive(props: { userId: string; messageId: string }): Promise<Either<Error, void>> {
    const { messageId, userId } = props;

    await this.prisma.messageStatus.updateMany({
      data: {
        received_at: new Date(),
      },
      where: {
        message_id: messageId,
        user_id: userId,
      },
    });

    return right(void 0);
  }

  async readUnreadMessagesByUserId(conversationId: string): Promise<Either<Error, void>> {
    await this.prisma.messageStatus.updateMany({
      data: {
        read_at: new Date(),
      },
      where: {
        conversation_id: conversationId,
      },
    });

    return right(void 0);
  }
}
