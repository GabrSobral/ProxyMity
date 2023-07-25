import 'dotenv/config';
import { sign } from 'jsonwebtoken';

import { IJsonWebToken, JWTPayload } from './json-web-token';

export class JsonWebToken implements IJsonWebToken {
  private _secret: string;

  constructor() {
    this._secret = process.env.JWT_SECRET || '';
  }

  sign(payload: JWTPayload, expiresInSeconds: number) {
    const token = sign(payload, this._secret!, {
      expiresIn: expiresInSeconds,
    });

    return token;
  }
}
