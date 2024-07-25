<script lang="ts">
   import { ArrowLeft, LogIn } from 'lucide-svelte';

   import WarningAlert from '../components/warning-alert.svelte';

   import Text from '$lib/design-system/text.svelte';
   import Button from '$lib/design-system/button/button.svelte';
   import InputGroup from '$lib/design-system/Input/InputGroup.svelte';
   import LoadingSpinning from '$lib/design-system/loading-spinning.svelte';
   import { forgotPasswordSendEmailAsync } from '../services/forgot-password-send-email-async';

   import { logError } from '../../../../utils/logging';

   //#region States
   let email = $state('');
   let isLoading = $state(false);

   let errorAlertConfig = $state('');
   let step = $state<'form' | 'success'>('form');
   //#endregion

   //#region Functions
   async function handleSubmit(e: SubmitEvent) {
      e.preventDefault();

      isLoading = true;
      errorAlertConfig = '';

      try {
         await forgotPasswordSendEmailAsync({ email });

         step = 'success';
      } catch (error: any) {
         logError(error);

         errorAlertConfig = JSON.stringify(error.errors);
      }

      isLoading = false;
   }
   //#endregion
</script>

<a
   href="/auth/login/sign-in"
   data-sveltekit-preload-data="hover"
   class="flex items-center gap-2 text-purple-300 text-sm hover:underline underline-offset-2"
>
   <ArrowLeft /> Go back to sign-in
</a>

{#if errorAlertConfig}
   <WarningAlert
      errorMessage={errorAlertConfig}
      closeAlert={() => {
         errorAlertConfig = '';
      }}
   />
{/if}

{#if step === 'form'}
   <Text size="md">We will send an e-mail to your inbox, type your e-mail account to receive the password reset link.</Text>
   <form onsubmit={handleSubmit} class="flex flex-col gap-4 w-full">
      <InputGroup let:Label let:Wrapper let:Input let:ErrorMessage>
         <Label className="text-white">E-mail</Label>

         <Wrapper className="w-full">
            <Input
               type="email"
               name="email"
               placeholder="Type your e-mail"
               autoComplete="email"
               title="Type your e-mail"
               bind:value={email}
               required
               className="bg-white/10 ring-gray-700 text-white placeholder:text-gray-100"
            />
         </Wrapper>
      </InputGroup>

      <Button type="submit" class="w-full" disabled={!email || isLoading} title={isLoading ? 'Loading...' : 'Sign In'}>
         {#if isLoading}
            <LoadingSpinning size={32} lineSize={2} color="white" />
         {:else}
            <LogIn size={32} class="text-white" />
            Send e-mail
         {/if}
      </Button>
   </form>
{/if}

{#if step === 'success'}
   <div class="flex flex-col gap-4 w-full">
      <Text size="md">The e-mail was successfully sent.</Text>

      <Text size="md">Verify in your e-mail inbox if you received our password reset e-mail.</Text>

      <Text size="md">Do not forget to verify in the spam inbox too. 😁</Text>
   </div>
{/if}
