import type { HubConnection } from "@microsoft/signalr";
import type { ILocalMessage } from "../../../../../types/message";
import { localToServerMessage } from "../chat-context/functions/parse-server-message";

interface ISendMessageWebSocketPayload {
    message: ILocalMessage;
    isConversationGroup: boolean;
 }

 interface ISendReadMessageWebSocketPayload {
    userId: string;
    conversationId: string;
    isConversationGroup: boolean;
 }

 interface ISendReceiveMessageWebSocketPayload {
    messageId: string;
    conversationId: string;
    userId: string;
    isConversationGroup: boolean;
 }

 interface ISendTypingWebSocketPayload {
    typing: boolean;
    conversationId: string;
    authorId: string;
 }

export class WebSocketEmmiter {
    constructor(
        private connection: HubConnection | null
    ) {}

    async sendMessage({ isConversationGroup, message }: ISendMessageWebSocketPayload): Promise<void> {
        const serverMessage = localToServerMessage(message);
        this.connection?.invoke('onSendMessage', { message: serverMessage, isConversationGroup });
    }

    async sendReadMessage(payload: ISendReadMessageWebSocketPayload) {
        this.connection?.invoke('onSendReadMessage', payload);
    }

    async sendReceiveMessage(payload: ISendReceiveMessageWebSocketPayload) {
        this.connection?.invoke('onSendReceiveMessage', payload);
    }

    async sendTyping(payload: ISendTypingWebSocketPayload) {
        this.connection?.invoke('onSendTyping', payload);
    }
}