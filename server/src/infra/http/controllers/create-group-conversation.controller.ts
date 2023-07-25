import { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, Post, Req, Res } from '@nestjs/common';

import { User } from '@application/entities/user';

import { CreateGroupUseCase } from '@application/use-cases/group/create-group';

interface IRequest {
  name: string;
  description?: string;
  participants: User['_id'][];
}

@Controller('conversation')
export class CreateGroupConversationController {
  constructor(private readonly createGroupUseCase: CreateGroupUseCase) {}

  @Post('group')
  async handle(@Req() request: FastifyRequest, @Res() response: FastifyReply) {
    const { name, description, participants } = request.body as IRequest;

    const result = await this.createGroupUseCase.execute({
      name,
      description: description ?? null,
      participants,
    });

    if (result.isLeft()) {
      return response.status(400).send({ error: result.value });
    }

    return response.status(201).send();
  }
}
