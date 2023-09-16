import { Injectable, Logger } from '@nestjs/common';

import { Message } from '@application/entities/message';

import { SaveMessageUseCase } from '@application/use-cases/message/save-message';
import { UpdateMessageStatusUseCase } from '@application/use-cases/message/update-message-status';
import { GetUserConversationsIdUseCase } from '@application/use-cases/conversation/get-user-conversations-id';
import { ReadConversationMessagesUseCase } from '@application/use-cases/conversation/read-conversation-messages';

import {
  IConnectPayload,
  IDisconnectPayload,
  ISendMessagePayload,
  ISendReadMessagePayload,
  ISendReceiveMessagePayload,
  ISendTypingPayload,
  IWebSocketEvents,
  MapConversationPayload,
  WSParams,
} from '@application/websocket/websocket-events';

import { receiveTypingWS } from './handlers/receiveTypingWS';
import { receiveMessageWS } from './handlers/receiveMessageWS';
import { receiveReadMessageWS } from './handlers/receiveReadMessageWS';
import { receiveMessageStatusWS } from './handlers/receiveMessageStatusWS';

@Injectable()
export class WebSocketEvents implements IWebSocketEvents {
  constructor(
    private readonly saveMessageUseCase: SaveMessageUseCase,
    private readonly updateMessageUseCase: UpdateMessageStatusUseCase,
    private readonly getUserConversationsIdUseCase: GetUserConversationsIdUseCase,
    private readonly readConversationMessagesUseCase: ReadConversationMessagesUseCase,
  ) {}

  getSocketsFromConversation(
    conversationId: string,
    conversations: Map<string, MapConversationPayload>,
  ): MapConversationPayload | null {
    const conversation = conversations.get(conversationId);
    return conversation || null;
  }

  async onClientConnect(params: WSParams<IConnectPayload>) {
    const { payload, socket, conversations, clients } = params;
    const { id } = payload;

    clients.set(id, { id, socket });
    Logger.log(`🟢 New socket connected: ${id} '👜 Qt: ${clients.size}`);

    const result = await this.getUserConversationsIdUseCase.execute({ userId: id });

    if (result.isLeft())
      return socket.send(JSON.stringify({ event: 'error', payload: { error: result.value } }), {
        binary: true,
      });

    result.value.conversationsId.forEach(conversationId => {
      const socketConversation = conversations.get(conversationId);

      if (socketConversation) {
        const newSockets = [...socketConversation.sockets, socket];
        conversations.set(socketConversation.id, { ...socketConversation, sockets: newSockets });

        Logger.log(`Socket was attached to ${conversationId} conversation: `);
      } else {
        conversations.set(conversationId, { id: conversationId, sockets: [socket] });

        Logger.log(`A new conversation instance was created: ${conversationId}`);
      }
    });
  }

  async onClientDisconnect(params: WSParams<IDisconnectPayload>): Promise<void> {
    const { payload, conversations, clients, socket } = params;
    const { id } = payload;

    clients.delete(id);

    Logger.log(`🔴 Socket disconnected 👜 Qt: ${clients.size}`);

    const result = await this.getUserConversationsIdUseCase.execute({ userId: id });

    if (result.isLeft())
      return socket.send(JSON.stringify({ event: 'error', payload: { error: result.value } }), {
        binary: true,
      });

    result.value.conversationsId.forEach(conversationId => {
      const socketConversation = conversations.get(conversationId);

      if (!socketConversation) {
        return;
      }

      if (socketConversation.sockets.length === 1) {
        conversations.delete(conversationId);
        Logger.log(`A conversation instance was deleted: ${conversationId}`);
      } else {
        const newSockets = socketConversation.sockets.filter(item => item !== socket);
        conversations.set(socketConversation.id, { ...socketConversation, sockets: newSockets });

        Logger.log(`Socket was removed from ${conversationId} conversation: `);
      }
    });
  }

  async onSendMessage(params: WSParams<ISendMessagePayload>): Promise<void> {
    const { conversations, payload, socket } = params;
    const { message, isConversationGroup } = payload;

    const conversation = this.getSocketsFromConversation(message.conversationId, conversations);

    if (!message || !conversation) {
      return;
    }

    const mySocket = socket;
    const messageInstance = Message.create(message, message.id);

    await this.saveMessageUseCase.execute({ message: messageInstance });

    conversation?.sockets.forEach(client => {
      if (mySocket !== client) {
        receiveMessageWS(client, { message });
        receiveTypingWS(client, { typing: false, authorId: message.authorId, conversationId: message.conversationId });
      }
    });

    this.updateMessageUseCase.execute({
      isConversationGroup,
      messageId: messageInstance.id,
      conversationId: messageInstance.conversationId,
      status: 'sent',
      userId: messageInstance.authorId,
    });

    receiveMessageStatusWS(mySocket, {
      status: 'sent',
      messageId: message.id,
      conversationId: message.conversationId,
    });
  }

  async onSendTyping(params: WSParams<ISendTypingPayload>): Promise<void> {
    const { payload, conversations, socket } = params;
    const { typing, conversationId, authorId } = payload;

    const conversation = this.getSocketsFromConversation(conversationId, conversations);

    if (conversation)
      conversation?.sockets.forEach(conversationSocket => {
        if (socket !== conversationSocket) {
          receiveTypingWS(conversationSocket, { typing, authorId, conversationId });
        }
      });
  }

  async onSendReadMessage(params: WSParams<ISendReadMessagePayload>): Promise<void> {
    const { payload, conversations, socket } = params;
    const { conversationId, userId, isConversationGroup } = payload;

    const conversation = this.getSocketsFromConversation(conversationId, conversations);
    await this.readConversationMessagesUseCase.execute({ conversationId, userId, isConversationGroup });

    if (conversation) {
      conversation?.sockets.forEach(client => {
        if (socket !== client) {
          receiveReadMessageWS(client, { conversationId, userId });
        }
      });
    }
  }

  async onSendReceiveMessage(params: WSParams<ISendReceiveMessagePayload>): Promise<void> {
    const { payload, conversations, socket } = params;
    const { conversationId, messageId, isConversationGroup, userId } = payload;

    const conversation = this.getSocketsFromConversation(conversationId, conversations);

    await this.updateMessageUseCase.execute({
      messageId,
      conversationId,
      isConversationGroup,
      status: 'received',
      userId,
    });

    if (conversation)
      conversation?.sockets.forEach(client => {
        if (socket !== client) {
          receiveMessageStatusWS(client, { status: 'received', conversationId, messageId });
        }
      });
  }
}
