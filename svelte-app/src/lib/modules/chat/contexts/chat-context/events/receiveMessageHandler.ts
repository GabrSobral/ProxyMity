import { page } from '$app/stores';
import { toast } from 'svelte-sonner';
import { browser } from '$app/environment';
import type { Session } from '@auth/sveltekit';

import { chatWorker } from '$lib/modules/chat/workers/db-worker/initializer';
import { WorkerMethods } from '$lib/modules/chat/workers/db-worker/method-types';

import type { IServerMessage } from '../../../../../../types/message';
import { EMessageStatuses } from '../../../../../../enums/EMessageStatuses';

import { chatDispatch, chatState } from '../stores/chat';

import { serverToLocalMessage } from '../functions/parse-server-message';

import { webSocketEmitter } from '../../websocket-context/stores/connection';
import type { WebSocketEmitter } from '../../websocket-context/WebSocketEmitter';
import type { ChatState } from '../stores/chat-store-types';

import { selectConversationAsync } from '../ChatContext.svelte';

let chatStateMod: ChatState;
let chatWorkerMod: Worker | null;
let webSocketEmitterMod: WebSocketEmitter;
let sessionMod: Session | null | undefined;

webSocketEmitter.subscribe(state => {
   webSocketEmitterMod = state;
});

chatWorker.subscribe(state => {
   chatWorkerMod = state;
});

if (browser) {
   page.subscribe(state => {
      sessionMod = state?.data?.session || null;
   });
}

chatState.subscribe(state => {
   chatStateMod = state;
});

// 🔵 Receive Message Handler
export async function receiveMessageHandler(serverMessage: IServerMessage) {
   const conversation = chatStateMod.conversations.find(item => item.id === serverMessage.conversationId);
   const conversationId = conversation?.id || '';
   const isConversationGroup = conversation?.isGroup || false;
   const userId = sessionMod?.user?.id || '';
   const messageId = serverMessage.id;

   const webSocketsPayload = { userId, conversationId, messageId, isConversationGroup };
   const localMessage = await serverToLocalMessage(serverMessage, isConversationGroup, userId);

   const targetConversationIsSelectedConversation =
      chatStateMod.selectedConversation && chatStateMod.selectedConversation?.id === serverMessage.conversationId;

   chatDispatch.addMessage({ message: localMessage });
   chatDispatch.bringToTop(conversationId);

   chatWorkerMod?.postMessage({ type: WorkerMethods.ADD_MESSAGE, payload: { message: localMessage } });

   webSocketEmitterMod.sendReceiveMessage(webSocketsPayload);
   chatDispatch.updateConversationMessageStatus({
      messageId,
      conversationId,
      userId,
      status: EMessageStatuses.RECEIVED,
      appliedForAll: false,
   });

   if (targetConversationIsSelectedConversation) {
      webSocketEmitterMod.sendReadMessage(webSocketsPayload);
      chatDispatch.updateConversationMessageStatus({
         conversationId,
         status: EMessageStatuses.READ,
         userId,
         appliedForAll: false,
      });
   } else {
      toast.message('New message', {
         id: serverMessage.id,
         description: serverMessage.content,
         action: {
            label: 'Open',
            onClick: () => conversation && selectConversationAsync(conversation),
         },
      });
   }
}
