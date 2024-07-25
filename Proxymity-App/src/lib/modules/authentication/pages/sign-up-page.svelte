<script lang="ts">
   import { goto } from '$app/navigation';
   import { signIn } from '@auth/sveltekit/client';
   import { Eye, UserPlus, EyeOff } from 'lucide-svelte';

   import Button from '$lib/design-system/button/button.svelte';
   import InputGroup from '$lib/design-system/Input/InputGroup.svelte';
   import LoadingSpinning from '$lib/design-system/loading-spinning.svelte';

   import WarningAlert from '../components/warning-alert.svelte';
   import StrongPasswordModal from '../components/strong-password-modal.svelte';
   import { logError } from '../../../../utils/logging';

   let firstName = $state('');
   let lastName = $state('');
   let email = $state('');
   let password = $state('');

   let showPassword = $state(false);
   let isLoading = $state(false);

   let isStrongPasswordModalVisible = $state(false);
   let errorAlertConfig = $state('');

   async function handleSubmit(e: SubmitEvent) {
      e.preventDefault();

      isLoading = true;
      errorAlertConfig = '';

      try {
         await signIn('credentials', { firstName, lastName, email, password, command: 'sign-up', redirect: false });

         goto('/chat');
      } catch (error: any) {
         logError(error?.response?.data || error?.message);
         errorAlertConfig = error?.response?.data.message || error?.message;
      }

      isLoading = false;
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

<form onsubmit={handleSubmit} class="flex flex-col gap-4 w-full">
   <InputGroup let:Label let:Wrapper let:Input let:ErrorMessage>
      <Label className="text-white">First Name</Label>

      <Wrapper className="w-full">
         <Input
            tabindex={1}
            type="text"
            name="firstName"
            placeholder="Type your first name"
            autoComplete="name"
            title="Type your first name"
            bind:value={firstName}
            required
            className="bg-white/10 ring-gray-700 text-white placeholder:text-gray-100"
         />
      </Wrapper>
   </InputGroup>

   <InputGroup let:Label let:Wrapper let:Input let:ErrorMessage>
      <Label className="text-white">Last Name</Label>

      <Wrapper className="w-full">
         <Input
            tabindex={1}
            type="text"
            name="lastName"
            placeholder="Type your last name"
            autoComplete="name"
            title="Type your last name"
            bind:value={lastName}
            className="bg-white/10 ring-gray-700 text-white placeholder:text-gray-100"
         />
      </Wrapper>
   </InputGroup>

   <InputGroup let:Label let:Wrapper let:Input let:ErrorMessage>
      <Label className="text-white">E-mail</Label>

      <Wrapper className="w-full">
         <Input
            tabindex={2}
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

   <InputGroup let:Label let:Wrapper let:Input let:ErrorMessage>
      <Label className="text-white">Password</Label>

      <Wrapper className="w-full">
         <Input
            tabindex={3}
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="**********"
            autoComplete="password"
            title="Type your password"
            bind:value={password}
            required
            className="bg-white/10 ring-gray-700 text-white placeholder:text-gray-100"
         />

         <button
            tabindex={4}
            type="button"
            aria-label={showPassword ? 'Hide password' : 'Show Password'}
            onclick={() => (showPassword = !showPassword)}
            class="absolute right-4 -translate-y-2/4 top-2/4"
            title={showPassword ? 'Hide password' : 'Show Password'}
         >
            {#if showPassword}
               <EyeOff class="dark:text-gray-200 text-white" size={24} />
            {:else}
               <Eye class="dark:text-gray-200 text-white" size={24} />
            {/if}
         </button>
      </Wrapper>

      <StrongPasswordModal
         setPasswordValue={newPassword => {
            password = newPassword;
         }}
      />
   </InputGroup>

   <Button type="submit" class="w-full" disabled={!(email && password) || isLoading} title={isLoading ? 'Loading...' : 'Sign In'}>
      {#if isLoading}
         <LoadingSpinning size={32} lineSize={2} color="white" />
      {:else}
         <UserPlus size={32} class="text-white" />
         Create Account
      {/if}
   </Button>
</form>
