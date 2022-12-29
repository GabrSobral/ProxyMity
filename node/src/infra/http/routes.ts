import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

import { SignUpContact } from '@application/use-cases/register-contact';
import { SignInContact } from '@application/use-cases/sign-in-contact';

import { JsonWebToken } from '@infra/authentication/jwt/JsonWebToken';
import { PrismaContactRepository } from '@infra/database/prisma/repositories/prisma-contact-repository';

import { SignUpControllerHandler } from './controllers/contact/sign-up-controller';
import { SignInControllerHandler } from './controllers/contact/sign-in-controller';

const routes = Router();

const signInControllerHandler = new SignInControllerHandler();
const signUpControllerHandler = new SignUpControllerHandler();

routes.post('/contact/sign-in', signInControllerHandler.handle);
routes.post('/contact/sign-up', signUpControllerHandler.handle);

export { routes };
