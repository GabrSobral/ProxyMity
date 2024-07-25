<script lang="ts">
   import { Camera, Mic, PhoneOff, ScreenShare } from 'lucide-svelte';
   import ParticipantCard from './participant-card.svelte';
</script>

<div class="w-full p-4 flex flex-col justify-between">
   <div class="flex flex-1 flex-wrap gap-3 justify-center items-center">
      <ParticipantCard isSpeaking isMuted={false} isCalling={false} />
      <ParticipantCard isSpeaking={false} isMuted isCalling={false} />
      <ParticipantCard isSpeaking={false} isMuted isCalling={true} />
   </div>

   <footer class="flex gap-3 w-fit mx-auto px-4 py-3 rounded-md justify-center mt-4 bg-black/50 backdrop-blur-sm">
      <button type="button" class="flex items-center justify-center rounded-md w-[3rem] h-[3rem] bg-slate-800">
         <ScreenShare class="text-white" />
      </button>

      <button type="button" class="flex items-center justify-center rounded-md w-[3rem] h-[3rem] bg-slate-800">
         <Camera class="text-white" />
      </button>

      <button type="button" class="flex items-center justify-center rounded-md w-[3rem] h-[3rem] bg-slate-800">
         <Mic class="text-white" />
      </button>

      <button type="button" class="flex items-center justify-center rounded-md w-[3rem] h-[3rem] bg-red-500">
         <PhoneOff class="text-white" />
      </button>
   </footer>
</div>
