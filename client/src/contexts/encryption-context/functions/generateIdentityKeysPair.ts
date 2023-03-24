import { DiffieHellman } from '../crypto/diffie-helmann';

export const generateIdentityKeysPair = () => {
	const dh = new DiffieHellman();

	const identityPublicKey = dh.signPublicKey();

	return {
		identityPrivateKey: dh.privateKey,
		identityPublicKey,
	};
};
