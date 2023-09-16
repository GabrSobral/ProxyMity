import { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, Post, Req, Res } from '@nestjs/common';

import { SignUpUseCase } from '@application/use-cases/user/sign-up';

import { UserViewModel } from '@infra/http/view-model/user-view-model';

interface IRequest {
  name: string;
  email: string;
  password: string;
}

@Controller('user')
export class SignUpController {
  constructor(private readonly _signUpUseCase: SignUpUseCase) {}

  @Post('sign-up')
  async handle(@Req() request: FastifyRequest, @Res() response: FastifyReply) {
    console.log('Calling SignUpControllerHandler:handle');

    const { name, email, password } = request.body as IRequest;

    const result = await this._signUpUseCase.execute({
      name,
      email,
      password,
    });

    if (result.isLeft())
      return response.status(400).send({
        message: result.value.message,
      });

    const { user, access_token } = result.value;

    return response.send({
      user: UserViewModel.parse(user),
      access_token,
    });
  }
}
