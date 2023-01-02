import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import FastifyWS, { SocketStream } from '@fastify/websocket';

import { Routes } from '@infra/http/fastify-routes';
import { WebSocketEvents } from '@infra/websockets/events';

const server = Fastify();

export interface MapPayload {
  id: string;
  socket: SocketStream;
}

async function bootstrap() {
  const PORT = process.env.PORT || 3001;

  await server.register(cors, { origin: '*' });
  await server.register(FastifyWS);

  const routes = new Routes(server);
  await routes.register();

  await server.register(async (instance) => {
    const clients = new Map<string, MapPayload>();
    const webSocketEvents = new WebSocketEvents(clients);

    instance.get('/', { websocket: true }, (socketStream, req) => {
      socketStream.socket.on('message', (message, isBinary) => {
        const { event, payload } = JSON.parse(message.toString());

        webSocketEvents[event]({ payload, socket: socketStream, isBinary });
      });

      socketStream.socket.on('close', () => {
        clients.forEach((item) => {
          if (item.socket === socketStream) {
            clients.delete(item.id);
            console.log('🎉 socket disconnected  ', item.id);
          }
        });

        socketStream.destroy();
      });
    });
  });

  server.listen({ port: Number(PORT), host: '0.0.0.0' }, () =>
    console.log(`🔥 Server started at http://localhost:${PORT}`),
  );
}
bootstrap();
