import { Module } from '@nestjs/common';

import { WsAdapter } from './ws-adapter';
import { EventsGateway } from './events-gateway';
import { WebSocketEvents } from './websocket-events';

import { HttpModule } from '@infra/http/http.module';

import { IWebSocketEvents } from '@application/websocket/websocket-events';

@Module({
  imports: [HttpModule],
  providers: [
    WsAdapter,
    EventsGateway,
    {
      provide: IWebSocketEvents,
      useClass: WebSocketEvents,
    },
  ],
})
export class WebSocketModule {}
