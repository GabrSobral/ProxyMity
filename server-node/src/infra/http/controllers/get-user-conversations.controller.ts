import { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, Get, Req, Res } from '@nestjs/common';

import { User } from '@application/entities/user';

import { GetUserConversationsUseCase } from '@application/use-cases/conversation/get-user-conversations';

interface IRequest {
  userId: User['_id'];
}

@Controller('conversation')
export class GetUserConversationsController {
  constructor(private readonly getUserConversationsUseCase: GetUserConversationsUseCase) {}

  @Get('get-by-user/:userId')
  async handle(@Req() request: FastifyRequest, @Res() response: FastifyReply) {
    const { userId } = request.params as IRequest;

    const result = await this.getUserConversationsUseCase.execute({ userId });

    if (result.isLeft()) {
      return response.status(400).send({ error: result.value });
    }
    return response.status(200).send(result.value);
  }
}
