import { Injectable } from '@nestjs/common';

import { Conversation } from '@application/entities/conversation';
import { MessageRepository } from '@application/repositories/message-repository';

import { IMessageViewModel } from '@infra/http/view-model/message-view-model';

import { Either, left, right } from '@helpers/Either';

interface Request {
  conversationId: Conversation['_id'];
}

interface Response {
  messages: IMessageViewModel[];
}

@Injectable()
export class GetConversationMessagesUseCase {
  constructor(private readonly messageRepository: MessageRepository) {}

  async execute({ conversationId }: Request): Promise<Either<Error, Response>> {
    const messages = await this.messageRepository.getMessagesFromConversation(conversationId, 50);

    if (messages.isLeft()) {
      return left(messages.value);
    }

    return right({ messages: messages.value });
  }
}
