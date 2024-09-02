import type { HubConnection } from '@microsoft/signalr';

interface IJoinCallWebSocketPayload {
   callId: string;
}

interface IExitCallWebSocketPayload {
   callId: string;
}

interface ICallChatWebSocketPayload {
   callId: string;
}

export class CallWebSocketEmitter {
   constructor(private connection: HubConnection | null) {}

   async joinCall({ callId }: IJoinCallWebSocketPayload): Promise<void> {
      this.connection?.invoke('onJoinCall', { callId });
   }

   async exitCall({ callId }: IExitCallWebSocketPayload) {
      this.connection?.invoke('onExitCall', { callId });
   }

   async callChat({ callId }: ICallChatWebSocketPayload) {
      this.connection?.invoke('onCallChat', { callId });
   }
}
