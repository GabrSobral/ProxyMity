<script lang="ts">
   import { goto } from '$app/navigation';
   import { browser } from '$app/environment';
   import { Eye, EyeOff, Lock, LogIn } from 'lucide-svelte';

   import Text from '$lib/design-system/Text.svelte';
   import Button from '$lib/design-system/button/button.svelte';
   import InputGroup from '$lib/design-system/Input/InputGroup.svelte';
   import LoadingSpinning from '$lib/design-system/LoadingSpinning.svelte';

   import WarningAlert from '../components/WarningAlert.svelte';
   import StrongPasswordModal from '../components/StrongPasswordModal.svelte';

   import { logError } from '../../../../utils/logging';
   import { forgotPasswordAsync } from '../services/forgot-password';
   import { cn } from '$lib/utils';

   let newPassword = $state('');
   let confirmPassword = $state('');

   let urlParams = $derived(new URLSearchParams(browser ? window.location.search : ''));
   const passwordResetId = $derived(urlParams.get('id'));
   const passwordResetToken = $derived(urlParams.get('token'));

   let isLoading = $state(false);
   let showNewPassword = $state(false);
   let passwordDoNotMatch = $state(false);
   let showConfirmPassword = $state(false);

   let step = $state<'form' | 'success'>('form');

   let errorAlertConfig = $state('');

   $effect(() => {
      newPassword;
      confirmPassword;

      passwordDoNotMatch = false;
   });

   async function handleSubmit(e: SubmitEvent) {
      e.preventDefault();

      isLoading = true;
      errorAlertConfig = '';

      if (newPassword.trim() !== confirmPassword.trim()) {
         passwordDoNotMatch = true;
         isLoading = false;
         return;
      }

      try {
         await forgotPasswordAsync({
            newPassword,
            passwordResetId: passwordResetId || '',
            passwordResetToken: passwordResetToken || '',
         });

         step = 'success';
      } catch (error: any) {
         logError(error?.response?.data || error?.message);
         errorAlertConfig = error?.response?.data.message || error?.message;
      } finally {
         isLoading = false;
      }
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

{#if step === 'success'}
   <Text size="md">Your password was successfully updated. Try to log in with your new credentials. ✅</Text>

   <a
      href="/auth/login/sign-in"
      data-sveltekit-preload-data="hover"
      class="disabled:cursor-not-allowed w-full disabled:opacity-40 min-h-[38px] border-solid h-fit whitespace-nowrap px-4 py-[0.375rem] rounded-md flex gap-2 items-center justify-center font-semibold hover:brightness-90 transition-all outline-none focus:outline-purple-500 focus:ring-0 border-purple-500 text-white bg-gradient-to-r from-[#B809A6] border-0 to-[#1C64CE]"
   >
      <LogIn size={32} class="text-white" /> Sign In
   </a>
{/if}

{#if step === 'form'}
   <Text size="md"
      >Please enter your new password and confirm it in the fields below. Make sure your password is strong and secure.
   </Text>

   <Text size="md">Once you submit, you'll be able to log in with your new credentials</Text>

   <form onsubmit={handleSubmit} class="flex flex-col gap-4 w-full">
      <InputGroup let:Label let:Wrapper let:Input let:ErrorMessage>
         <Label className="text-white">New Password</Label>

         <Wrapper className="w-full">
            <Input
               tabindex={3}
               type={showNewPassword ? 'text' : 'password'}
               name="password"
               placeholder="**********"
               autoComplete="password"
               title="Type your new password"
               bind:value={newPassword}
               required
               className="bg-white/10 ring-gray-700 text-white placeholder:text-gray-100"
            />

            <button
               tabindex={4}
               type="button"
               aria-label={showNewPassword ? 'Hide password' : 'Show Password'}
               onclick={() => (showNewPassword = !showNewPassword)}
               class="absolute right-4 -translate-y-2/4 top-2/4"
               title={showNewPassword ? 'Hide password' : 'Show Password'}
            >
               {#if showNewPassword}
                  <EyeOff class="dark:text-gray-200 text-white" size={24} />
               {:else}
                  <Eye class="dark:text-gray-200 text-white" size={24} />
               {/if}
            </button>
         </Wrapper>
      </InputGroup>

      <InputGroup let:Label let:Wrapper let:Input let:ErrorMessage>
         <Label className="text-white">Confirm Password</Label>

         <Wrapper className="w-full">
            <Input
               tabindex={5}
               type={showConfirmPassword ? 'text' : 'password'}
               name="password"
               placeholder="**********"
               autoComplete="password"
               title="Type your new password again"
               bind:value={confirmPassword}
               required
               className="bg-white/10 ring-gray-700 text-white placeholder:text-gray-100"
            />

            <button
               tabindex={6}
               type="button"
               aria-label={showConfirmPassword ? 'Hide password' : 'Show Password'}
               onclick={() => (showConfirmPassword = !showConfirmPassword)}
               class="absolute right-4 -translate-y-2/4 top-2/4"
               title={showConfirmPassword ? 'Hide password' : 'Show Password'}
            >
               {#if showConfirmPassword}
                  <EyeOff class="dark:text-gray-200 text-white" size={24} />
               {:else}
                  <Eye class="dark:text-gray-200 text-white" size={24} />
               {/if}
            </button>
         </Wrapper>
      </InputGroup>

      <StrongPasswordModal
         setPasswordValue={newStrongPassword => {
            newPassword = newStrongPassword;
            confirmPassword = newStrongPassword;
         }}
      />

      {#if passwordDoNotMatch}
         <Text size="md" class="text-red-500">The passwords don't match. Verify them to continue</Text>
      {/if}

      <Button
         type="submit"
         class="w-full"
         disabled={!(newPassword && confirmPassword && !passwordDoNotMatch) || isLoading}
         title={isLoading ? 'Loading...' : 'Sign In'}
      >
         {#if isLoading}
            <LoadingSpinning size={32} lineSize={2} color="white" />
         {:else}
            <Lock size={32} class="text-white" />
            Save new password
         {/if}
      </Button>
   </form>
{/if}
