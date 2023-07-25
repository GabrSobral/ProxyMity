import { Module } from '@nestjs/common';

import { SignInController } from './controllers/sign-in.controller';
import { SignUpController } from './controllers/sign-up.controller';
import { SearchUserByIdController } from './controllers/search-user-by-id.controller';
import { SearchUserByEmailController } from './controllers/search-user-by-email.controller';

import { SignInUseCase } from '@application/use-cases/user/sign-in';
import { SignUpUseCase } from '@application/use-cases/user/sign-up';
import { SearchByIdUseCase } from '@application/use-cases/user/search-by-id';
import { SearchByEmailUseCase } from '@application/use-cases/user/search-by-email';
import { GetUserConversationsIdUseCase } from '@application/use-cases/conversation/get-user-conversations-id';
import { CreatePrivateConversationUseCase } from '@application/use-cases/conversation/create-private-conversation';
import { CreateGroupUseCase } from '@application/use-cases/group/create-group';

import { DatabaseModule } from '@infra/database/database.module';
import { AuthenticationModule } from '@infra/authentication/authentication.module';
import { SaveMessageUseCase } from '@application/use-cases/message/save-message';
import { UpdateMessageStatusUseCase } from '@application/use-cases/message/update-message-status';
import { CreatePrivateConversationController } from './controllers/create-private-conversation.controller';
import { CreateGroupConversationController } from './controllers/create-group-conversation.controller';
import { GetUserConversationsController } from './controllers/get-user-conversations.controller';
import { GetUserConversationsUseCase } from '@application/use-cases/conversation/get-user-conversations';

@Module({
  imports: [DatabaseModule, AuthenticationModule],
  controllers: [
    SignInController,
    SignUpController,
    SearchUserByIdController,
    SearchUserByEmailController,

    CreatePrivateConversationController,
    CreateGroupConversationController,
    GetUserConversationsController,
  ],
  providers: [
    SignInUseCase,
    SignUpUseCase,
    SearchByIdUseCase,
    SearchByEmailUseCase,

    SaveMessageUseCase,
    GetUserConversationsIdUseCase,
    GetUserConversationsUseCase,
    UpdateMessageStatusUseCase,

    CreatePrivateConversationUseCase,
    CreateGroupUseCase,
  ],
  exports: [
    SignInUseCase,
    SignUpUseCase,
    SearchByIdUseCase,
    SearchByEmailUseCase,

    SaveMessageUseCase,
    GetUserConversationsIdUseCase,
    GetUserConversationsUseCase,
    UpdateMessageStatusUseCase,

    CreatePrivateConversationUseCase,
    CreateGroupUseCase,
  ],
})
export class HttpModule {}
