import { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, Post, Req, Res } from '@nestjs/common';

import { SignInUseCase } from '@application/use-cases/user/sign-in';

import { UserViewModel } from '@infra/http/view-model/user-view-model';

interface IRequest {
  email: string;
  password: string;
}

@Controller('user')
export class SignInController {
  constructor(private readonly _signInUseCase: SignInUseCase) {}

  @Post('sign-in')
  async handle(@Req() request: FastifyRequest, @Res() response: FastifyReply) {
    console.log('Calling SignInControllerHandler:handle');

    const { email, password } = request.body as IRequest;

    const result = await this._signInUseCase.execute({
      email,
      password,
    });

    if (result.isLeft())
      return response.status(400).send({
        message: result.value.message,
      });

    const { user, access_token } = result.value;

    return response.send({
      data: UserViewModel.parse(user),
      access_token,
    });
  }
}
