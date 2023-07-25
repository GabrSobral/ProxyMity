import { Module } from '@nestjs/common';

import { HttpModule } from '@infra/http/http.module';
import { WebSocketModule } from '@infra/websockets/websocket.module';

@Module({
  imports: [HttpModule, WebSocketModule],
})
export class AppModule {}
