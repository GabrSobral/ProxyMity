import { chatDispatch } from '../stores/chat';

// 🔵 Receive Pending Messages Handler
export function receivePendingMessagesHandler(userId: string) {
   chatDispatch.markAsReceivedMessagesFromConversations({ userId });
}
