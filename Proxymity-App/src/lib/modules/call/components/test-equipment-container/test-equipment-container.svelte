<script lang="ts">
   import { ArrowLeft } from 'lucide-svelte';

   import Heading from '$lib/design-system/heading.svelte';
   import DropdownRoot from '$lib/design-system/dropdown-menu/dropdown-root.svelte';
   import DropdownTrigger from '$lib/design-system/dropdown-menu/dropdown-trigger.svelte';
   import MicrophoneTestAudio from './microphone-test-audio.svelte';
</script>

<div class="flex flex-1 h-screen bg-black/75 items-center justify-center bg-red-50 relative">
   <a
      href="/chat"
      data-sveltekit-preload-data
      title="Go back to Chat"
      class="p-4 rounded-md absolute top-4 left-4 bg-gray-800 hover:brightness-90 transition-all"
   >
      <ArrowLeft class="text-white" size="24" />
   </a>

   <div class="rounded-md p-4 bg-gray-950">
      <Heading size="md">Check your equipment before enter the call</Heading>

      <MicrophoneTestAudio />

      <div>
         <DropdownRoot>
            <DropdownTrigger></DropdownTrigger>
         </DropdownRoot>
      </div>
   </div>
</div>
