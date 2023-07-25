import { mergeMap, filter } from 'rxjs/operators';
import { Observable, fromEvent, EMPTY } from 'rxjs';
import { Server, WebSocket, RawData, ServerOptions } from 'ws';

import { MessageMappingProperties } from '@nestjs/websockets';
import { INestApplicationContext, Logger, WebSocketAdapter } from '@nestjs/common';

import { IWebSocketEvents, MapClientPayload } from '@application/websocket/websocket-events';

import { toBinary } from '@utils/binary-parser';
import { ContextIdFactory } from '@nestjs/core';

export class WsAdapter implements WebSocketAdapter<Server, WebSocket, ServerOptions> {
  constructor(private app: INestApplicationContext) {}

  create(port: number, options: ServerOptions = {}): Server {
    const server = new WebSocket.Server({ port, ...options });
    Logger.log(`WebSocket server port: ${port}`);

    return server;
  }

  bindClientConnect(server: Server, callback: Function) {
    server.on('connection', socket => {
      Logger.log('A new connection was established');
      callback(socket);
    });
  }

  bindClientDisconnect(socket: WebSocket, callback: Function) {
    socket.on('close', code => {
      Logger.log('A connection was disestablished');
      callback(code);
    });
  }

  bindMessageHandlers(
    socket: WebSocket,
    handlers: MessageMappingProperties[],
    process: (data: any) => Observable<void>,
  ) {
    fromEvent(socket, 'message')
      .pipe(
        mergeMap((data: any) => this.bindMessageHandler(data, handlers, process)),
        filter(result => result),
      )
      .subscribe(response => socket.send(response));
  }

  private bindMessageHandler(
    buffer: MessageEvent,
    handlers: MessageMappingProperties[],
    process: (data: any) => Observable<void>,
  ): Observable<any> {
    // const { event, payload } = JSON.parse(buffer.toString());
    const { event, payload } = JSON.parse(buffer.data);
    const messageHandler = handlers.find(handler => handler.message === event);

    if (messageHandler) {
      return process(messageHandler.callback(payload));
    } else {
      return EMPTY;
    }
  }

  close(server: Server) {
    server.close(() => {
      Logger.log('🙅‍♂️🙅‍♀️ WebSocket server was closed');
    });
  }
}
