import { Server, WebSocket } from 'ws';
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';

import {
  MapConversationPayload,
  IConnectPayload,
  IWebSocketEvents,
  ISendTypingPayload,
  ISendMessagePayload,
  ISendReadMessagePayload,
  ISendReceiveMessagePayload,
  IDisconnectPayload,
  MapClientPayload,
} from '@application/websocket/websocket-events';

@WebSocketGateway(5000, {})
export class EventsGateway {
  private clients: Map<MapClientPayload['id'], MapClientPayload> = new Map();
  private conversations: Map<MapConversationPayload['id'], MapConversationPayload> = new Map();

  constructor(private readonly events: IWebSocketEvents) {
    // Heartbeat
    setInterval(() => {
      this.clients.forEach(client => {
        const connection = client.socket as WebSocket & { isAlive: boolean };

        if (connection.isAlive === false) {
          this.onDisconnect(connection, { id: client.id });
          return connection.terminate();
        }

        connection.isAlive = false;
        connection.ping();
      });
    }, 30000);
  }

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('connect')
  onConnect(socket: WebSocket, payload: IConnectPayload): void {
    const params = { conversations: this.conversations, payload, socket, clients: this.clients };
    this.events.onClientConnect(params);
  }

  @SubscribeMessage('disconnect')
  onDisconnect(socket: WebSocket, payload: IDisconnectPayload): void {
    const params = { conversations: this.conversations, payload, socket, clients: this.clients };
    this.events.onClientDisconnect(params);
  }

  @SubscribeMessage('send_message')
  onSendMessage(socket: WebSocket, payload: ISendMessagePayload): void {
    const params = { conversations: this.conversations, payload, socket, clients: this.clients };
    this.events.onSendMessage(params);
  }

  @SubscribeMessage('send_typing')
  onSendTyping(socket: WebSocket, payload: ISendTypingPayload): void {
    const params = { conversations: this.conversations, payload, socket, clients: this.clients };
    this.events.onSendTyping(params);
  }

  @SubscribeMessage('send_read_message')
  onSendReadMessage(socket: WebSocket, payload: ISendReadMessagePayload): void {
    const params = { conversations: this.conversations, payload, socket, clients: this.clients };
    this.events.onSendReadMessage(params);
  }

  @SubscribeMessage('send_receive_message')
  onSendReceiveMessage(socket: WebSocket, payload: ISendReceiveMessagePayload): void {
    const params = { conversations: this.conversations, payload, socket, clients: this.clients };
    this.events.onSendReceiveMessage(params);
  }
}
