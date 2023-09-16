import { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, Get, Req, Res } from '@nestjs/common';

import { Conversation } from '@application/entities/conversation';

import { GetConversationMessagesUseCase } from '@application/use-cases/conversation/get-conversation-messages';

interface IRequest {
  conversationId: Conversation['_id'];
}

@Controller('conversation')
export class GetConversationMessagesController {
  constructor(private readonly getConversationMessagesUseCase: GetConversationMessagesUseCase) {}

  @Get('messages/:conversationId')
  async handle(@Req() request: FastifyRequest, @Res() response: FastifyReply) {
    const { conversationId } = request.params as IRequest;

    const result = await this.getConversationMessagesUseCase.execute({ conversationId });

    if (result.isLeft()) {
      return response.status(400).send({ error: result.value });
    }

    return response.status(200).send(result.value);
  }
}
