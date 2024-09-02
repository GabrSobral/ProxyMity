import Peer from 'peerjs';
import { type MediaConnection, type PeerError, type PeerOptions } from 'peerjs';

import type { Media } from './media';

export class PeerBuilder {
   private peers: Map<string, MediaConnection> = new Map();
   public currentStream: MediaStream | null = null;

   public currentPeer: Peer | null = null;

   constructor(
      public peerId: string,
      public peerConfig: PeerOptions,
      public media: Media
   ) {}

   private _prepareCallEvent(call: MediaConnection) {
      call.on('stream', stream => this._onPeerStreamReceived(call, stream));
      call.on('error', error => this.onCallError(call, error));
      call.on('close', () => this.onCallClose(call));

      this.onCallReceived(call);
   }

   addVideoStream(userId: string, stream = this.currentStream) {
      const isCurrentId = userId === this.currentPeer?.id;
   }

   private _onPeerStreamReceived(call: MediaConnection, stream: MediaStream) {
      const callerId = call.peer;

      if (this.peers.has(callerId)) {
         console.log('calling twice, ignoring second call...', callerId);
         return;
      }

      this.addVideoStream(callerId, stream);
      this.peers.set(callerId, call);
   }

   onCallError(call: MediaConnection, error: PeerError<'negotiation-failed' | 'connection-closed'>) {
      const userId = call.peer;

      if (this.peers.has(userId)) {
         this.peers.get(userId)?.close();
         this.peers.delete(userId);
      }
   }

   onUserConnected(userId: string) {
      console.log('user connected!', userId);

      if (this.currentPeer && this.currentStream) {
         this.currentPeer.call(userId, this.currentStream);
      }
   }

   onUserDisconnected(userId: string) {
      console.log('user disconnected!', userId);

      if (this.peers.has(userId)) {
         this.peers.get(userId).call.close();
         this.peers.delete(userId);
      }
   }

   onCallClose(call: MediaConnection) {
      console.log('call closed!!', call.peer);
   }

   onCallReceived(call: MediaConnection) {
      if (this.currentStream) {
         call.answer(this.currentStream);
      }
   }

   private _preparePeerInstanceFunction() {
      class PeerCustomModule extends Peer {
         constructor(id: string, params: PeerOptions) {
            super(id, params);
         }
      }

      const peerCall = PeerCustomModule.prototype.call;
      const context = this;

      PeerCustomModule.prototype.call = function (id, stream) {
         const call = peerCall.apply(this, [id, stream]);
         // aqui acontece a magia, interceptamos o call e adicionamos todos os eventos
         //  da chamada para quem liga também
         context._prepareCallEvent(call);

         return call;
      };

      return PeerCustomModule;
   }

   private async _createPeer() {
      this.currentStream = await this.media.getCamera();

      const PeerCustomInstance = this._preparePeerInstanceFunction();
      const peer = new PeerCustomInstance(this.peerId, this.peerConfig);

      peer.on('error', console.log);
      peer.on('call', this._prepareCallEvent.bind(this));

      return new Promise<Peer>(resolve =>
         peer.on('open', id => {
            // this.onConnectionOpened(peer);
            return resolve(peer);
         })
      );
   }

   async build() {
      this.currentPeer = await this._createPeer();

      console.log('Peer created', this.currentPeer);

      this.addVideoStream(this.currentPeer.id);
   }
}
