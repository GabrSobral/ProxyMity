<script lang="ts">
   import { goto } from '$app/navigation';
   import { signIn } from '@auth/sveltekit/client';
   import { Eye, UserPlus, EyeOff } from "lucide-svelte"

   import Button from '$lib/design-system/Button.svelte';
   import InputGroup from '$lib/design-system/Input/InputGroup.svelte';
   import LoadingSpinning from '$lib/design-system/LoadingSpinning.svelte';

   import WarningAlert from '../components/WarningAlert.svelte';
   import StrongPasswordModal from '../components/StrongPasswordModal.svelte';

   let name = '';
   let email = '';
   let password = '';

   let showPassword = false;
   let isLoading = false;

   let isStrongPasswordModalVisible = false;
   let errorAlertConfig = '';

   async function handleSubmit() {
      isLoading = true;

      try {
         await signIn('credentials', { name, email, password, command: 'sign-up', redirect: false });

         goto('/chat');
      } catch (error: any) {
         console.log(error?.response?.data || error?.message);
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

<form on:submit|preventDefault={handleSubmit} class="flex flex-col gap-4 w-full">
   <InputGroup let:Label let:Wrapper let:Input let:ErrorMessage>
      <Label className="text-white">Name</Label>

      <Wrapper className="w-full">
         <Input
            tabindex={1}
            type="text"
            name="name"
            placeholder="Type your name"
            autoComplete="name"
            title="Type your name"
            bind:value={name}
            required
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
            on:click={() => (showPassword = !showPassword)}
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

      <StrongPasswordModal setPasswordValue={newPassword => { password = newPassword; }}/>
   </InputGroup>

   

   <Button
      tabIndex={6}
      type="submit"
      className="w-full"
      disabled={!(email && password) || isLoading}
      title={isLoading ? 'Loading...' : 'Sign In'}
   >
      {#if isLoading}
         <LoadingSpinning size={32} lineSize={2} color="white" />
      {:else}
         <UserPlus size={32} class="text-white" />
         Create Account
      {/if}
   </Button>
</form>
