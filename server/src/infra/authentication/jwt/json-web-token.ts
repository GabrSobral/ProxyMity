export interface JWTPayload {
  email: string;
}

export abstract class IJsonWebToken {
  abstract sign: (payload: JWTPayload, expiresInSeconds: number) => string;
}
