import { DiffieHellman } from '../crypto/diffie-helmann';

export const generateOneTimePreKeys = (identityPrivateKey: Uint8Array, quantity: number) => {
	const dh = new DiffieHellman(identityPrivateKey);
	const array = new Array(quantity);

	return array.map(x => {
		console.log(x);
		dh.signPublicKey();
	});
};
