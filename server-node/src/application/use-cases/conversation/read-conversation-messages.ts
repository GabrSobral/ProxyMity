import { Injectable } from '@nestjs/common';

import { User } from '@application/entities/user';
import { Conversation } from '@application/entities/conversation';

import { MessageRepository } from '@application/repositories/message-repository';
import { ConversationRepository } from '@application/repositories/conversation-repository';
import { MessageStatusRepository } from '@application/repositories/message-status-repository';

import { Either, left, right } from '@helpers/Either';

interface Request {
  userId: User['_id'];
  conversationId: Conversation['_id'];
  isConversationGroup: boolean;
}

interface Response {}

type HandlerProps = Request & { conversation: Conversation };

@Injectable()
export class ReadConversationMessagesUseCase {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly conversationRepository: ConversationRepository,
    private readonly messageStatusRepository: MessageStatusRepository,
  ) {}

  async execute(props: Request): Promise<Either<Error, Response>> {
    const { conversationId, isConversationGroup } = props;

    const conversation = await this.conversationRepository.getById(conversationId);

    if (conversation.isLeft()) {
      return left(new Error(`Error on try to get conversation: ${conversation.value}`));
    }

    if (!conversation.value) {
      return left(new Error('No conversation was found with this id.'));
    }

    if (isConversationGroup) {
      return await this.groupConversationHandler({ ...props, conversation: conversation.value });
    } else {
      return await this.privateConversationHandler({ ...props, conversation: conversation.value });
    }
  }

  private async groupConversationHandler({ userId, conversationId }: HandlerProps): Promise<Either<Error, Response>> {
    await this.messageStatusRepository.readUnreadMessagesByUserId(userId, conversationId);

    const result = await this.messageStatusRepository.getUnreadMessagesStatusFromConversationById(conversationId);

    if (result.isLeft()) {
      return left(new Error('Database operation error.'));
    }

    const allUnreadMessageStatusFromConversation = result.value;
    const allParticipantsReadTheMessage = allUnreadMessageStatusFromConversation.length === 0;

    if (allParticipantsReadTheMessage) {
      await this.messageRepository.readUnreadMessageByConversationId(userId, conversationId);
    }

    return right({});
  }

  private async privateConversationHandler({ userId, conversationId }: HandlerProps): Promise<Either<Error, Response>> {
    await this.messageRepository.readUnreadMessageByConversationId(userId, conversationId);

    return right({});
  }
}
