export interface JWTPayload {
  email: string;
}

export interface IJsonWebToken {
  sign: (payload: JWTPayload, expiresInSeconds: number) => string;
}
