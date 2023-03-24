import CryptoJS from 'crypto-js';

export class AES256_CBC {
	constructor(private cipherKey: string, private initializationVector: string) {}

	public encrypt(plainText: string) {
		const cipherText = CryptoJS.AES.encrypt(plainText, this.cipherKey, {
			iv: CryptoJS.enc.Hex.parse(this.initializationVector),
			mode: CryptoJS.mode.CBC,
			format: CryptoJS.format.Hex,
			padding: CryptoJS.pad.Pkcs7,
		});

		return cipherText;
	}

	public decrypt(cipherText: string) {
		const plainText = CryptoJS.AES.decrypt(cipherText, this.cipherKey, {
			iv: CryptoJS.enc.Hex.parse(this.initializationVector),
			mode: CryptoJS.mode.CBC,
			format: CryptoJS.format.Hex,
			padding: CryptoJS.pad.Pkcs7,
		});

		return plainText;
	}
}
