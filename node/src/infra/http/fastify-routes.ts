import { PrismaClient } from '@prisma/client';
import { FastifyInstance } from 'fastify';

import { JsonWebToken } from '@infra/authentication/jwt/JsonWebToken';
import { PrismaContactRepository } from '@infra/database/prisma/repositories/prisma-contact-repository';

import { SignInControllerHandler } from './controllers/contact/sign-in-controller';
import { SignUpControllerHandler } from './controllers/contact/sign-up-controller';
import { SearchContactByEmailControllerHandler } from './controllers/contact/search-contact-by-email-controller';
import { SearchContactByIdControllerHandler } from './controllers/contact/search-contact-by-id-controller';

export class Routes {
  constructor(private fastify: FastifyInstance) {}
  async register() {
    await this.fastify.register(this.signIn);
    await this.fastify.register(this.signUp);
    await this.fastify.register(this.searchContactByEmail);
    await this.fastify.register(this.searchContactById);
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

  async searchContactByEmail(fastify: FastifyInstance) {
    const prismaClient = new PrismaClient();
    const prismaContactRepository = new PrismaContactRepository(prismaClient);

    const handler = new SearchContactByEmailControllerHandler(
      prismaContactRepository,
    );

    fastify.get('/contact/search-by-email/:email', async (request, reply) => {
      await handler.handle(request, reply);
    });
  }

  async searchContactById(fastify: FastifyInstance) {
    const prismaClient = new PrismaClient();
    const prismaContactRepository = new PrismaContactRepository(prismaClient);

    const handler = new SearchContactByIdControllerHandler(
      prismaContactRepository,
    );

    fastify.get('/contact/search-by-id/:id', async (request, reply) => {
      await handler.handle(request, reply);
    });
  }
}
