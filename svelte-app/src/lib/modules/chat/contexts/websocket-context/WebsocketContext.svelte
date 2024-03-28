<script lang="ts">
   import { page } from '$app/stores';
   import { afterUpdate } from 'svelte';
   import { HttpTransportType, HubConnectionBuilder, HubConnectionState, LogLevel } from '@microsoft/signalr';

   import { connection } from './stores/connection';

   $: accessToken = $page.data.session?.accessToken;

   afterUpdate(() => {
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

   afterUpdate(() => {
      if (connection && $connection?.state === HubConnectionState.Disconnected) {
         $connection.start().then(async () => console.log('🖥️ Client connected to hub.'));
      }
   });
</script>

<slot><!-- optional fallback --></slot>
