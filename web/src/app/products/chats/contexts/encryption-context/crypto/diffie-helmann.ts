// import * as ed25519 from '@noble/ed25519';
import ed25519 from '@noble/curves/ed25519';

export interface DiffieHellmanKeysPair {
	publicKey: Uint8Array;
	privateKey: Uint8Array;
}

export class DiffieHellman {
	private readonly _privateKey: Uint8Array;

	get privateKey(): Uint8Array {
		return this._privateKey;
	}

	constructor(prevPrivateKey?: Uint8Array) {
		this._privateKey = prevPrivateKey ?? ed25519.ed25519.utils.randomPrivateKey();
	}

	public signPublicKey() {
		const publicKey = ed25519.ed25519.getPublicKey(this._privateKey);

		return publicKey;
	}

	static createSharedKey(publicKey: Uint8Array, privateKey: Uint8Array) {
		const newSharedKey = ed25519.x25519.scalarMult(privateKey, publicKey);

		return newSharedKey;
	}
}
