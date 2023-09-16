import { Module } from '@nestjs/common';
import { IJsonWebToken } from './jwt/json-web-token';
import { JsonWebToken } from './jwt/JsonWebToken';

@Module({
  imports: [],
  providers: [
    {
      provide: IJsonWebToken,
      useClass: JsonWebToken,
    },
  ],
  exports: [IJsonWebToken],
})
export class AuthenticationModule {}
