import { Injectable, Logger } from '@nestjs/common';

import { PrismaService } from '../prisma.service';

import { Conversation } from '@application/entities/conversation';
import { ConversationRepository } from '@application/repositories/conversation-repository';

import { PrismaConversationMapper } from '../mappers/prisma-conversation.mapper';

import { Either, left, right } from '@helpers/Either';

@Injectable()
export class PrismaConversationRepository implements ConversationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(conversation: Conversation): Promise<Either<Error, void>> {
    await this.prisma.conversation.create({
      data: {
        id: conversation.id,
        group_id: conversation.groupId,
        is_group: conversation.isGroup,
        disabled_at: conversation.disabledAt,
        created_at: conversation.createdAt,
      },
    });

    return right(void 0);
  }

  async disableConversationById(conversationId: string): Promise<Either<Error, void>> {
    await this.prisma.conversation.update({
      data: { disabled_at: new Date() },
      where: { id: conversationId },
    });

    return right(void 0);
  }

  async getById(conversationId: string): Promise<Either<Error, Conversation | null>> {
    try {
      const result = await this.prisma.conversation.findUnique({ where: { id: conversationId } });

      if (!result) return right(null);

      return right(PrismaConversationMapper.toDomain(result));
    } catch (error) {
      Logger.error(error);
      return left(new Error('Error on try to access conversation repository'));
    }
  }
}
