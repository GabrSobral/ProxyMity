import { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, Post, Req, Res } from '@nestjs/common';

import { SearchByIdUseCase } from '@application/use-cases/user/search-by-id';

import { UserViewModel } from '@infra/http/view-model/user-view-model';

interface IRequest {
  id: string;
}

@Controller('user')
export class SearchUserByIdController {
  constructor(private _searchByIdUseCase: SearchByIdUseCase) {}

  @Post('search-by-id/:id')
  async handle(@Req() request: FastifyRequest, @Res() response: FastifyReply) {
    const { id } = request.params as IRequest;

    const result = await this._searchByIdUseCase.execute({ id });

    if (result.isLeft())
      return response.status(400).send({
        message: result.value.message,
      });

    const { user } = result.value;

    return response.send({
      data: user ? UserViewModel.parse(user) : null,
    });
  }
}
