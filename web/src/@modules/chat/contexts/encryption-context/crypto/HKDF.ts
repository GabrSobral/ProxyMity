import hkdf from 'js-crypto-hkdf';

export class HKDF {
	static async generate(ikm: Uint8Array, salt: Uint8Array, info: string, keylen: number) {
		return await hkdf.compute(ikm, 'SHA-512', keylen, info, salt);
	}
}
