// 🔵 Receive Message Status Handler
export function receiveMessageStatusHandler(...args: [string, string, string, string, boolean]) {
   const [messageStatus, messageId, conversationId, userId, appliedForAll] = args;

   const messageDetail = { messageStatus, messageId, conversationId, userId, type: 'message_status', appliedForAll };
   const messageStatusEvent = new CustomEvent(messageId, { detail: messageDetail });

   dispatchEvent(messageStatusEvent);
}
