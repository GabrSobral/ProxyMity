export function toBinary(value: string) {
	const textEncoder = new TextEncoder();
	const utf8 = new Uint8Array(value.length);

	textEncoder.encodeInto(value, utf8);

	return utf8;
}

export function toText(binary: Uint8Array) {
	const textEncoder = new TextDecoder();

	return textEncoder.decode(binary);
}
