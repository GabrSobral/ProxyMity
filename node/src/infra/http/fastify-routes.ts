import { PrismaClient } from '@prisma/client';
import { FastifyInstance } from 'fastify';

import { JsonWebToken } from '@infra/authentication/jwt/JsonWebToken';
import { PrismaContactRepository } from '@infra/database/prisma/repositories/prisma-contact-repository';

import { SignInControllerHandler } from './controllers/contact/sign-in-controller';
import { SignUpControllerHandler } from './controllers/contact/sign-up-controller';
import { SearchContactControllerHandler } from './controllers/contact/search-contact-controller';

export class Routes {
  constructor(private fastify: FastifyInstance) {}
  async register() {
    await this.fastify.register(this.signIn);
    await this.fastify.register(this.signUp);
    await this.fastify.register(this.searchContact);
  }

  async signIn(fastify: FastifyInstance) {
    const prismaClient = new PrismaClient();
    const jsonWebTokenHandler = new JsonWebToken();
    const prismaContactRepository = new PrismaContactRepository(prismaClient);

    const handler = new SignInControllerHandler(
      jsonWebTokenHandler,
      prismaContactRepository,
    );

    fastify.post('/contact/sign-in', async (request, reply) => {
      await handler.handle(request, reply);
    });
  }

  async signUp(fastify: FastifyInstance) {
    const prismaClient = new PrismaClient();
    const jsonWebTokenHandler = new JsonWebToken();
    const prismaContactRepository = new PrismaContactRepository(prismaClient);

    const handler = new SignUpControllerHandler(
      prismaContactRepository,
      jsonWebTokenHandler,
    );

    fastify.post('/contact/sign-up', async (request, reply) => {
      await handler.handle(request, reply);
    });
  }

  async searchContact(fastify: FastifyInstance) {
    const prismaClient = new PrismaClient();
    const prismaContactRepository = new PrismaContactRepository(prismaClient);

    const handler = new SearchContactControllerHandler(prismaContactRepository);

    fastify.get('/contact/search/:email', async (request, reply) => {
      await handler.handle(request, reply);
    });
  }
}
