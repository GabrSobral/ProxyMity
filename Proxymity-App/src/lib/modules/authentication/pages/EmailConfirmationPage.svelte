<script lang="ts">
   import { goto } from '$app/navigation';
   import { MessageCircleHeartIcon } from 'lucide-svelte';

   import Text from '$lib/design-system/Text.svelte';
   import Button from '$lib/design-system/button/button.svelte';
   import LoadingSpinning from '$lib/design-system/LoadingSpinning.svelte';

   import WarningAlert from '../components/WarningAlert.svelte';

   import { page } from '$app/stores';

   let isLoading = $state(false);

   let errorAlertConfig = $state('');

   let isConfirmed = $derived($page.data.isConfirmed as boolean);
   let error = $derived($page.data.error as any);

   $inspect($page.data);
   $inspect($page.data.error.errors);

   async function handleSubmit() {
      isLoading = true;
      goto('/chat');
   }
</script>

{#if errorAlertConfig}
   <WarningAlert
      errorMessage={errorAlertConfig}
      closeAlert={() => {
         errorAlertConfig = '';
      }}
   />
{/if}

{#if isConfirmed}
   <img
      src="/no-messages.svg"
      width="250"
      class="mb-6"
      alt="Success ProxyMity, that shows to chat boxes on left side, and a purple planet on right side."
   />

   <div class="flex flex-col gap-1">
      <Text size="md">Your email has been <span class="font-bold text-purple-300">successfully confirmed!</span></Text>
      <Text size="md">You will now be able to log in to your account to use the ProxyMity system</Text>
   </div>

   <Button
      class="w-full mt-6"
      onclick={handleSubmit}
      disabled={isLoading}
      title={isLoading ? 'Loading...' : 'Navigate to chat app'}
   >
      {#if isLoading}
         <LoadingSpinning size={32} lineSize={2} color="white" />
      {:else}
         <MessageCircleHeartIcon size={32} class="text-white" />
         Navigate to chat app
      {/if}
   </Button>
{/if}

{#if error}
   <div class="flex flex-col gap-1">
      <Text size="md">An <span class="text-red-500 font-bold">error</span> ocurred on trying to confirm your e-mail.</Text>

      <Text size="md" class="mt-2">{error.title}</Text>
   </div>
{/if}
