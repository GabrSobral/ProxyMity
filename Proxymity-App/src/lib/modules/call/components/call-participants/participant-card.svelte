<script lang="ts">
   import { clsx } from 'clsx';
   import Text from '$lib/components/ui/text.svelte';
   import { CameraOff, MicOff, Mic } from 'lucide-svelte';

   import type { ConversationState } from '$lib/modules/chat/contexts/chat-context/stores/chat-store-types';

   interface Props {
      isCalling: boolean;
      isSpeaking: boolean;
      isMuted: boolean;
      user: ConversationState['participants'][0] | null;
   }

   let { isCalling, isSpeaking, isMuted, user }: Props = $props();
</script>

<div
   class={clsx(
      'relative rounded-md flex-col flex gap-2 items-center justify-center flex-1 min-w-[25rem] min-h-[15rem] max-w-[25rem] border border-gray-800 transition-all p-2 bg-gradient-to-br from-[#136DCE]/50 via-[50%] via-black/50 backdrop-blur-lg',
      {
         'animate-pulse': isCalling,
         'border-2 border-purple-500': isSpeaking,
      }
   )}
>
   <strong class="text-white font-medium mr-auto">Gabriel Sobral</strong>
   <div class="flex flex-1 justify-center items-center">
      <img alt="" src="https://github.com/GabrSobral.png" class="rounded-full w-[5rem] h-[5rem] shadow-lg" />
   </div>

   <div class="mx-auto flex gap-1 w-full justify-center mt-auto">
      {#if isCalling}
         <Text size="md">Calling...</Text>
      {:else}
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
      {/if}
   </div>
</div>
