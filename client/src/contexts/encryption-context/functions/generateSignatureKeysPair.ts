import { DiffieHellman } from '../crypto/diffie-helmann';

export const generateSignatureKey = (identityPrivateKey: Uint8Array) => {
	const dh = new DiffieHellman(identityPrivateKey);
	const signaturePublicKey = dh.signPublicKey();

	return signaturePublicKey;
};
