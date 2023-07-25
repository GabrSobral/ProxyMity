import { Module } from '@nestjs/common/decorators';

import { PrismaService } from './prisma/prisma.service';

import { UserRepository } from '@application/repositories/user-repository';
import { MessageRepository } from '@application/repositories/message-repository';

import { PrismaUserRepository } from './prisma/repositories/prisma-user-repository';
import { PrismaMessageRepository } from './prisma/repositories/prisma-message-repository';

import { ParticipantRepository } from '@application/repositories/participant-repository';
import { PrismaParticipantRepository } from './prisma/repositories/prisma-participant-repository';

import { ConversationRepository } from '@application/repositories/conversation-repository';
import { PrismaConversationRepository } from './prisma/repositories/prisma-conversation-repository';

import { MessageStatusRepository } from '@application/repositories/message-status-repository';
import { PrismaMessageStatusRepository } from './prisma/repositories/prisma-message-status-repository';

import { GroupRepository } from '@application/repositories/group-repository';
import { PrismaGroupRepository } from './prisma/repositories/prisma-group-repository';

@Module({
  providers: [
    PrismaService,
    {
      // User Repository DI
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
    {
      // Message Repository DI
      provide: MessageRepository,
      useClass: PrismaMessageRepository,
    },
    {
      // Participant Repository DI
      provide: ParticipantRepository,
      useClass: PrismaParticipantRepository,
    },
    {
      // Conversation Repository DI
      provide: ConversationRepository,
      useClass: PrismaConversationRepository,
    },
    {
      // Message Status Repository DI
      provide: MessageStatusRepository,
      useClass: PrismaMessageStatusRepository,
    },
    {
      // Group Repository DI
      provide: GroupRepository,
      useClass: PrismaGroupRepository,
    },
  ],
  exports: [
    UserRepository,
    MessageRepository,
    ParticipantRepository,
    ConversationRepository,
    MessageStatusRepository,
    GroupRepository,
  ],
})
export class DatabaseModule {}
