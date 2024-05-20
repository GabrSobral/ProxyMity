<script lang="ts">
   import { page } from '$app/stores';
   import { HttpTransportType, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';

   import { connection } from './stores/connection';

   const accessToken = $derived($page.data.session?.accessToken);

   let { children } = $props();

   $effect(() => {
      if (accessToken) {
         const hubConnection = new HubConnectionBuilder()
            .withUrl('http://localhost:5000/chat', {
               accessTokenFactory: () => accessToken || '',
               transport: HttpTransportType.WebSockets,
               skipNegotiation: true,
               withCredentials: true,
               logMessageContent: false,
            })
            .build();

         connection.set(hubConnection);
      }
   });

   $effect(() => {
      if (connection && $connection?.state === HubConnectionState.Disconnected) {
         $connection.start().then(async () => console.log('🖥️ Client connected to hub.'));
      }
   });
</script>

{@render children()}
