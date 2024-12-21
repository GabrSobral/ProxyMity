export function logSuccess(...data: unknown[]): void {
   console.log(`🟢 \u001b[32m ${data}`);
}

export function logError(...data: unknown[]): void {
   console.error(`🔴 \u001b[31m ${data}`);
}

export function logDebug(...data: unknown[]): void {
   console.debug(`🟣 \u001b[35m ${data}`);
}
