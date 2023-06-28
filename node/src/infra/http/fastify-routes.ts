import { PrismaClient } from '@prisma/client';
import { FastifyInstance } from 'fastify';

import { JsonWebToken } from '@infra/authentication/jwt/JsonWebToken';
import { PrismaUserRepository } from '@infra/database/prisma/repositories/prisma-user-repository';

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
    const prismaUserRepository = new PrismaUserRepository(prismaClient);

    const handler = new SignInControllerHandler(jsonWebTokenHandler, prismaUserRepository);

    fastify.post('/contact/sign-in', handler.handle);
  }

  async signUp(fastify: FastifyInstance) {
    const prismaClient = new PrismaClient();
    const jsonWebTokenHandler = new JsonWebToken();
    const prismaUserRepository = new PrismaUserRepository(prismaClient);

    const handler = new SignUpControllerHandler(prismaUserRepository, jsonWebTokenHandler);

    fastify.post('/contact/sign-up', handler.handle);
  }

  async searchContactByEmail(fastify: FastifyInstance) {
    const prismaClient = new PrismaClient();
    const prismaUserRepository = new PrismaUserRepository(prismaClient);

    const handler = new SearchContactByEmailControllerHandler(prismaUserRepository);

    fastify.get('/contact/search-by-email/:email', handler.handle);
  }

  async searchContactById(fastify: FastifyInstance) {
    const prismaClient = new PrismaClient();
    const prismaUserRepository = new PrismaUserRepository(prismaClient);

    const handler = new SearchContactByIdControllerHandler(prismaUserRepository);

    fastify.get('/contact/search-by-id/:id', handler.handle);
  }

  async createConversation(fastify: FastifyInstance) {
    const prismaClient = new PrismaClient();
  }
}
