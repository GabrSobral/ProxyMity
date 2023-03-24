import { DiffieHellman } from '../crypto/diffie-helmann';

export const generateOneTimePreKeys = (identityPrivateKey: Uint8Array, quantity: number) => {
	const dh = new DiffieHellman(identityPrivateKey);

	return [...Array(quantity).keys()].map(_ => dh.signPublicKey());
};
