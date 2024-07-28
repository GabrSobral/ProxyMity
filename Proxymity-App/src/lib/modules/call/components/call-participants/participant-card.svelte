<script lang="ts">
   import { clsx } from 'clsx';
   import Text from '$lib/design-system/text.svelte';
   import { CameraOff, MicOff, Mic } from 'lucide-svelte';
   import type { ConversationState } from '$lib/modules/chat/contexts/chat-context/stores/chat-store-types';

   interface Props {
      isCalling: boolean;
      isSpeaking: boolean;
      isMuted: boolean;
      user: ConversationState['participants'][0] | null;
   }

   type $$Props = Props;

   let { isCalling, isSpeaking, isMuted, user }: Props = $props();
</script>

<div
   class={clsx(
      'relative rounded-md flex items-center justify-center w-[25rem] h-[15rem] border border-gray-800 transition-all p-2 bg-gradient-to-br from-[#136DCE]/50 via-[50%] via-black/50 backdrop-blur-lg',
      {
         'animate-pulse': isCalling,
         'border-2 border-purple-500': isSpeaking,
      }
   )}
>
   <strong class="absolute top-4 left-4 text-white font-medium"> Gabriel Sobral</strong>

   <img alt="" src="https://github.com/GabrSobral.png" class="rounded-full w-[5rem] h-[5rem] shadow-lg" />
   {#if isCalling}
      <div class="absolute flex gap-2 bottom-4 -translate-x-2/4 left-2/4">
         <Text size="md">Calling...</Text>
      </div>
   {:else}
      <div class="absolute flex gap-2 bottom-4 -translate-x-2/4 left-2/4">
         <button type="button" class="rounded-md p-2 bg-slate-900" title="Disable user mic">
            {#if isMuted}
               <Mic class="text-white" size={18} />
            {:else}
               <MicOff class="text-white" size={18} />
            {/if}
         </button>

         <button type="button" class="rounded-md p-2 bg-slate-900" title="Disable user camera">
            <CameraOff class="text-white" size={18} />
         </button>
      </div>
   {/if}
</div>
