export function toBinary(value: string): Uint8Array {
	const textEncoder = new TextEncoder();
	return textEncoder.encode(value);
}

export function toText(binary: Uint8Array): string {
	const textEncoder = new TextDecoder('utf-8');
	return textEncoder.decode(binary);
}
