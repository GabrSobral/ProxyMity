import { signalDatabase } from '../signal-database';

export async function setSignedPairPreKeysAsyncDB({ publicKey }: { publicKey: Uint8Array }) {
   const id = await signalDatabase.signedPreKeys.add({
      publicKey,
   });

   return id;
}
