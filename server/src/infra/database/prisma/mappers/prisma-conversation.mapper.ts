import { Conversation as PrismaConversation } from '@prisma/client';

import { Conversation } from '@application/entities/conversation';

export class PrismaConversationMapper {
  static toDomain(raw: PrismaConversation): Conversation {
    if (raw.is_group)
      return Conversation.create(
        {
          createdAt: raw.created_at,
          disabledAt: raw.disabled_at || undefined,
          isGroup: true,
          groupId: raw.group_id!,
        },
        raw.id,
      );
    else
      return Conversation.create(
        {
          createdAt: raw.created_at,
          disabledAt: raw.disabled_at || undefined,
          isGroup: false,
        },
        raw.id,
      );
  }

  static toPrisma(conversation: Conversation): PrismaConversation {
    return {
      id: conversation.id,
      group_id: conversation.groupId,
      is_group: conversation.isGroup,
      created_at: conversation.createdAt,
      disabled_at: conversation.disabledAt,
    };
  }
}
