import { Participant as PrismaParticipant } from '@prisma/client';

import { Participant } from '@application/entities/participant';

export class PrismaParticipantMapper {
  static toDomain(raw: PrismaParticipant): Participant {
    return Participant.create({
      userId: raw.userId,
      conversationId: raw.conversationId,
      createdAt: raw.createdAt,
      removedAt: raw.removedAt || undefined,
    });
  }

  static toPrisma(participant: Participant): PrismaParticipant {
    return {
      userId: participant.userId,
      conversationId: participant.conversationId,
      createdAt: participant.createdAt,
      removedAt: participant.removedAt,
    };
  }
}
