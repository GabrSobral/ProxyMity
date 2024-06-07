import { page } from '$app/stores';
import type { Session } from '@auth/sveltekit';

import { chatDispatch } from '../stores/chat';

import { chatWorker } from '$lib/modules/chat/workers/db-worker/initializer';
import { WorkerMethods } from '$lib/modules/chat/workers/db-worker/method-types';

import { EMessageStatuses } from '../../../../../../enums/EMessageStatuses';
import { browser } from '$app/environment';

let sessionMod: Session | null | undefined;
let chatWorkerMod: Worker | null;

chatWorker.subscribe(state => {
   chatWorkerMod = state;
});

if (browser)
   page.subscribe(state => {
      sessionMod = state?.data?.session || null;
   });

// 🔵 Receive Read Message Handler
export async function receiveReadMessageHandler(...args: [string, string, boolean, boolean]) {
   if (!sessionMod?.user) return;

   const [conversationId, userId, isConversationGroup, readByAll] = args;

   chatDispatch.updateConversationMessageStatus({
      conversationId,
      status: EMessageStatuses.READ,
      userId,
      appliedForAll: readByAll,
   });

   chatWorkerMod?.postMessage({
      type: WorkerMethods.READ_CONVERSATION_MESSAGES,
      payload: { conversationId, myId: sessionMod?.user?.id, whoRead: userId, isConversationGroup },
   });
}
