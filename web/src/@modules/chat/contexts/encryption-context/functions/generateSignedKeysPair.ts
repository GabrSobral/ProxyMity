import { DiffieHellman } from '../crypto/diffie-helmann';

export const generateSignedKey = (identityPrivateKey: Uint8Array) => {
	const dh = new DiffieHellman(identityPrivateKey);
	const signedPublicKey = dh.signPublicKey();

	return signedPublicKey;
};
