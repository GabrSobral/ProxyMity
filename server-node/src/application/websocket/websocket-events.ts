import { WebSocket } from 'ws';

import { User } from '@application/entities/user';
import { Message } from '@application/entities/message';
import { Conversation } from '@application/entities/conversation';

export interface MapConversationPayload {
  id: Conversation['_id'];
  sockets: WebSocket[];
}

export interface MapClientPayload {
  id: User['_id'];
  socket: WebSocket;
}

export interface WSParams<T = any> {
  socket: WebSocket;
  payload: T;
  conversations: Map<MapConversationPayload['id'], MapConversationPayload>;
  clients: Map<MapClientPayload['id'], MapClientPayload>;
}

export interface IConnectPayload {
  id: User['_id'];
}

export interface IDisconnectPayload {
  id: User['_id'];
}

export interface ISendMessagePayload {
  message: Message;
  isConversationGroup: boolean;
}

export interface ISendTypingPayload {
  typing: boolean;
  conversationId: Conversation['_id'];
  authorId: User['_id'];
}

export interface ISendReadMessagePayload {
  conversationId: Conversation['_id'];
  isConversationGroup: boolean;
  userId: User['_id'];
}

export interface ISendReceiveMessagePayload {
  conversationId: Conversation['_id'];
  userId: User['_id'];
  messageId: Message['_id'];
  isConversationGroup: boolean;
}

export abstract class IWebSocketEvents {
  abstract getSocketsFromConversation(
    socketId: string,
    websocketConversations: Map<MapConversationPayload['id'], MapConversationPayload>,
  ): MapConversationPayload | null;

  abstract onClientConnect(params: WSParams<IConnectPayload>): Promise<void>;
  abstract onClientDisconnect(params: WSParams<IDisconnectPayload>): Promise<void>;
  abstract onSendTyping(params: WSParams<ISendTypingPayload>): Promise<void>;
  abstract onSendMessage(params: WSParams<ISendMessagePayload>): Promise<void>;
  abstract onSendReadMessage(params: WSParams<ISendReadMessagePayload>): Promise<void>;
  abstract onSendReceiveMessage(params: WSParams<ISendReceiveMessagePayload>): Promise<void>;
}
