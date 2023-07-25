import { Injectable, Logger } from '@nestjs/common';

import { Message } from '@application/entities/message';

import { SaveMessageUseCase } from '@application/use-cases/message/save-message';
import { UpdateMessageStatusUseCase } from '@application/use-cases/message/update-message-status';
import { GetUserConversationsIdUseCase } from '@application/use-cases/conversation/get-user-conversations-id';

import {
  IConnectPayload,
  IDisconnectPayload,
  ISendMessagePayload,
  ISendReadMessagePayload,
  ISendReceiveMessagePayload,
  ISendTypingPayload,
  IWebSocketEvents,
  MapClientPayload,
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
  ) {}

  getSocketsFromConversation(
    conversationId: string,
    conversations: Map<string, MapConversationPayload>,
  ): MapConversationPayload['sockets'] | null {
    const conversation = conversations.get(conversationId);
    return conversation ? conversation.sockets : null;
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
    const { message, conversationIsGroup } = payload;

    const conversationSockets = this.getSocketsFromConversation(message.conversationId, conversations);

    if (!message || !conversationSockets) {
      return;
    }

    const mySocket = socket;
    const messageInstance = Message.create(message, message.id);

    await this.saveMessageUseCase.execute({ message: messageInstance });

    conversationSockets.forEach(async socket => {
      receiveMessageWS(socket, { message });
      receiveTypingWS(socket, { typing: false, authorId: message.authorId });
      receiveMessageStatusWS(mySocket, {
        status: 'sent',
        messageId: message.id,
        conversationId: message.conversationId,
      });

      await this.updateMessageUseCase.execute({
        conversationIsGroup,
        message: messageInstance,
        status: 'sent',
        userId: messageInstance.authorId,
      });
    });
  }

  async onSendTyping(params: WSParams<ISendTypingPayload>): Promise<void> {
    const { payload, conversations } = params;
    const { typing, conversationId, authorId } = payload;

    const conversationSockets = this.getSocketsFromConversation(conversationId, conversations);

    if (conversationSockets) conversationSockets.forEach(socket => receiveTypingWS(socket, { typing, authorId }));
  }

  async onSendReadMessage(params: WSParams<ISendReadMessagePayload>): Promise<void> {
    const { payload, conversations } = params;
    const { conversationId } = payload;

    const conversationSockets = this.getSocketsFromConversation(conversationId, conversations);

    if (conversationSockets) conversationSockets.forEach(socket => receiveReadMessageWS(socket, { conversationId }));
  }

  async onSendReceiveMessage(params: WSParams<ISendReceiveMessagePayload>): Promise<void> {
    const { payload, conversations } = params;
    const { conversationId, messageId } = payload;

    const conversationSockets = this.getSocketsFromConversation(conversationId, conversations);

    if (conversationSockets)
      conversationSockets.forEach(socket =>
        receiveMessageStatusWS(socket, { status: 'received', conversationId, messageId }),
      );
  }
}
