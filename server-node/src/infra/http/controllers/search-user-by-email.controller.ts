import { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, Post, Req, Res } from '@nestjs/common';

import { SearchByEmailUseCase } from '@application/use-cases/user/search-by-email';

import { UserViewModel } from '@infra/http/view-model/user-view-model';

interface IRequest {
  email: string;
}

@Controller('user')
export class SearchUserByEmailController {
  constructor(private _searchByEmailUseCase: SearchByEmailUseCase) {}

  @Post('search-by-email/:email')
  async handle(@Req() request: FastifyRequest, @Res() response: FastifyReply) {
    const { email } = request.params as IRequest;

    const result = await this._searchByEmailUseCase.execute({ email });

    if (result.isLeft()) {
      return response.status(400).send({ message: result.value.message });
    }

    const { user } = result.value;

    return response.send({
      data: user ? UserViewModel.parse(user) : null,
    });
  }
}
