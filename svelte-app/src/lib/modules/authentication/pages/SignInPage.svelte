<script lang="ts">
   import { signIn } from '@auth/sveltekit/client';
   import { Eye, LogIn, EyeOff } from 'lucide-svelte';

   import WarningAlert from '../components/WarningAlert.svelte';

   import Button from '$lib/design-system/button/button.svelte';
   import InputGroup from '$lib/design-system/Input/InputGroup.svelte';
   import LoadingSpinning from '$lib/design-system/LoadingSpinning.svelte';
   import { goto } from '$app/navigation';

   //#region States
   let email = '';
   let password = '';

   let showPassword = false;
   let isLoading = false;

   let errorAlertConfig = '';
   //#endregion

   //#region Functions
   async function handleSubmit() {
      isLoading = true;

      try {
         const response = await signIn('credentials', { email, password, command: 'sign-in', redirect: false });
         const content = await response?.json();

         goto('/chat');
      } catch (error: any) {
         console.log({ error });

         errorAlertConfig = JSON.stringify(error);
      }

      isLoading = false;
   }
   //#endregion
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

   <InputGroup let:Label let:Wrapper let:Input let:ErrorMessage>
      <Label className="text-white">Password</Label>

      <Wrapper className="w-full">
         <Input
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="**********"
            autoComplete="password"
            title="Type your password"
            bind:value={password}
            required
            className="bg-white/10 ring-gray-700 text-white dark:text-white placeholder:text-gray-100"
         />

         <button
            type="button"
            aria-label={showPassword ? 'Hide password' : 'Show Password'}
            on:click={() => (showPassword = !showPassword)}
            class="absolute right-4 -translate-y-2/4 top-2/4"
            title={showPassword ? 'Hide password' : 'Show Password'}
         >
            {#if showPassword}
               <EyeOff class="dark:text-gray-200 text-gray-100" size={24} />
            {:else}
               <Eye class="dark:text-gray-200 text-gray-100" size={24} />
            {/if}
         </button>
      </Wrapper>
   </InputGroup>

   <Button type="submit" class="w-full" disabled={!(email && password) || isLoading} title={isLoading ? 'Loading...' : 'Sign In'}>
      {#if isLoading}
         <LoadingSpinning size={32} lineSize={2} color="white" />
      {:else}
         <LogIn size={32} class="text-white" />
         Sign In
      {/if}
   </Button>
</form>
