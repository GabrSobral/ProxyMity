import { Injectable } from '@nestjs/common';

import { Conversation } from '@application/entities/conversation';

import { ConversationRepository } from '@application/repositories/conversation-repository';

import { Either, left, right } from '@helpers/Either';

interface Request {
  conversationId: Conversation['_id'];
}

interface Response {
  conversationId: Conversation['_id'];
}

@Injectable()
export class DisableConversationUseCase {
  constructor(private readonly conversationRepository: ConversationRepository) {}

  async execute({ conversationId }: Request): Promise<Either<Error, Response>> {
    const conversation = await this.conversationRepository.getById(conversationId);

    if (conversation.isLeft()) {
      return left(new Error(`Error on try to get conversation: ${conversation.value}`));
    }

    if (!conversation.value) {
      return left(new Error('No conversation was found with this Id.'));
    }

    await this.conversationRepository.disableConversationById(conversationId);

    return right({ conversationId: conversation.value.id });
  }
}
