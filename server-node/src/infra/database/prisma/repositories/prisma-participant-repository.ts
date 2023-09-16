import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma.service';

import { Group } from '@application/entities/group';
import { Participant } from '@application/entities/participant';
import { Conversation } from '@application/entities/conversation';

import {
  IGetConversationsByUserIdResponse,
  IGetParticipantsByConversationIdResponse,
  ParticipantRepository,
} from '@application/repositories/participant-repository';

import { PrismaParticipantMapper } from '../mappers/prisma-participant.mapper';

import { Either, right } from '@helpers/Either';

@Injectable()
export class PrismaParticipantRepository implements ParticipantRepository {
  constructor(private readonly prisma: PrismaService) {}

  async add(participant: Participant): Promise<Either<Error, void>> {
    await this.prisma.participant.create({
      data: {
        userId: participant.userId,
        conversationId: participant.conversationId,
        createdAt: participant.createdAt,
        removedAt: participant.removedAt,
      },
    });

    return right(void 0);
  }

  async getByConversationId(conversationId: string): Promise<Either<Error, Participant[]>> {
    const participantOfConversations = await this.prisma.participant.findMany({
      where: { conversationId },
    });

    return right(participantOfConversations.map(PrismaParticipantMapper.toDomain));
  }

  async getConversationsByUserId(userId: string): Promise<Either<Error, IGetConversationsByUserIdResponse[]>> {
    const conversations = await this.prisma.$queryRaw<IGetConversationsByUserIdResponse[]>`
      SELECT 
        "Conversation"."id", 
        "Conversation"."is_group" "isGroup",
        "Conversation"."disabled_at" "disabledAt",
        "Conversation"."created_at" "createdAt",
        "Group"."name" "groupName",
        "Group"."description" "groupDescription"
      FROM "Participant"
      INNER JOIN "Conversation" ON "Conversation"."id" = "Participant"."conversationId"
      LEFT JOIN "Group" ON "Conversation"."group_id" = "Group"."id"
      WHERE "Participant"."userId"=${userId}
    `;

    return right(conversations);
  }

  async getParticipantsByConversationId(
    conversationId: string,
  ): Promise<Either<Error, IGetParticipantsByConversationIdResponse[]>> {
    const participants = await this.prisma.$queryRaw<IGetParticipantsByConversationIdResponse[]>`
      SELECT 
        "User"."id",
        "User"."name",
        "User"."email",
        "User"."photoUrl",
        "User"."lastOnline",
        "Participant"."createdAt" "enteredAt",
        "Participant"."removedAt"
      FROM "Participant"
      INNER JOIN "User" ON "User"."id" = "Participant"."userId"
      WHERE "Participant"."conversationId"=${conversationId}
    `;

    return right(participants);
  }

  async getByUserId(userId: string): Promise<Either<Error, Participant[]>> {
    const conversationsOfUser = await this.prisma.participant.findMany({ where: { userId } });

    return right(conversationsOfUser.map(PrismaParticipantMapper.toDomain));
  }

  async remove(participant: Participant): Promise<Either<Error, void>> {
    await this.prisma.participant.delete({
      where: {
        userId_conversationId: {
          conversationId: participant.conversationId,
          userId: participant.userId,
        },
      },
    });

    return right(void 0);
  }
}
