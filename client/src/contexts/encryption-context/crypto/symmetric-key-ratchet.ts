import { toBinary } from '../../../utils/binary-parser';
import { HKDF } from './HKDF';

export class SymmetricKeyRatchet {
	static KeyDerivedFunction(key: string) {
		// const chainKey = crypto.hkdfSync('sha512', key, 'salt', 'info', 64);
		const chainKey = HKDF.generate(toBinary(key), new Uint8Array(), '', 64);

		return chainKey;
	}
}
