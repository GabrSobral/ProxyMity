import { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, Post, Req, Res } from '@nestjs/common';

import { User } from '@application/entities/user';

import { CreatePrivateConversationUseCase } from '@application/use-cases/conversation/create-private-conversation';

interface IRequest {
  participants: User['_id'][];
}

@Controller('conversation')
export class CreatePrivateConversationController {
  constructor(private readonly createPrivateConversationUseCase: CreatePrivateConversationUseCase) {}

  @Post('private')
  async handle(@Req() request: FastifyRequest, @Res() response: FastifyReply) {
    const { participants } = request.body as IRequest;

    const result = await this.createPrivateConversationUseCase.execute({ participants });

    if (result.isLeft()) {
      return response.status(400).send({ error: result.value });
    }

    return response.status(201).send({ conversationId: result.value.conversation.id });
  }
}
