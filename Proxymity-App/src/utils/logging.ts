export function logSuccess(...data: any[]): void {
   console.log(`🟢 \u001b[32m ${data}`);
}

export function logError(...data: any[]): void {
   console.error(`🔴 \u001b[31m ${data}`);
}

export function logDebug(...data: any[]): void {
   console.debug(`🟣 \u001b[35m ${data}`);
}
