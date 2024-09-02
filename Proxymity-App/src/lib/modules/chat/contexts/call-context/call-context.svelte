<script lang="ts">
   import { onMount } from 'svelte';
   import { page } from '$app/stores';
   import type { PeerOptions } from 'peerjs';

   import { Media } from './functions/media';
   import { peerState } from './stores/peer';
   import { PeerBuilder } from './functions/peer';

   import { logError, logSuccess } from '../../../../../utils/logging';

   import { getUserByIdAsync } from '../../services/getUserByIdAsync';
   import { connection } from '../websocket-context/stores/connection';

   import CallNotification from '$lib/modules/call/components/call-notification/call-notification.svelte';

   type Props = { children: any };
   let { children }: Props = $props();

   let accessToken = $page.data.session?.accessToken;
   let userId = $derived($page.data.session?.user.id as string | null);

   let callState = $state<{
      chatId: string;
      userId: string;
   } | null>(null);

   async function createWebRtcPeer() {
      const peerConfig: PeerOptions = {
         port: 9000,
         key: 'peerjs',
         host: 'localhost',
         path: '/',
      };

      const media = new Media();
      peerState.set(new PeerBuilder(userId || '', peerConfig, media));

      await $peerState
         ?.build()
         .then(() => logSuccess('The WebRTC peer was successfully created!'))
         .catch(error => logError('Occurred an error on trying to create the WebRTC peer.', error));
   }

   onMount(createWebRtcPeer);

   $effect(() => {
      if ($connection) {
         $connection?.on('receiveusercallconnected', userId => {
            alert(userId);

            getUserByIdAsync({ userId }, { accessToken }).then(user => {
               console.log('User was fetched', user);
            });

            $peerState?.onUserConnected(userId);
         });

         $connection?.on('receiveusercalldisconnected', userId => $peerState?.onUserDisconnected(userId));
         $connection?.on('receivechatcall', (chatId, userId) => {
            console.log({ chatId, userId });

            if (chatId && userId) {
               callState = { chatId, userId };

               setTimeout(() => {
                  callState = null;
               }, 15000);
            }
         });

         logSuccess('Call connection events created.');
      }
   });
</script>

{@render children()}

{#if callState}
   <CallNotification
      chatId={callState.chatId}
      userId={callState.userId}
      closeNotification={() => {
         callState = null;
      }}
   />
{/if}
