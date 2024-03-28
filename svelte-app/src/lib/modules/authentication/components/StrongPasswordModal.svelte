<script lang="ts">
   import { Eye, Key, Copy, Check, AlertCircle, EyeOff, RefreshCcw } from 'lucide-svelte';

   import * as Dialog from '$lib/design-system/dialog';

   export let setPasswordValue: (newPassword: string) => void;

   let strongPassword = generatePassword();
   let isPasswordVisible = false;
   let isCopied = false;

   let isModalOpened = false;

   function generatePassword(): string {
      const passwordLength = 18;
      const charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';

      let password = '';
      for (let i = 0; i < passwordLength; i++) {
         const randomIndex = Math.floor(Math.random() * charSet.length);
         password += charSet[randomIndex];
      }

      return password;
   }

   function copyToClipboard() {
      navigator.clipboard.writeText(strongPassword);
      isCopied = true;

      setTimeout(() => {
         isCopied = false;
      }, 1000);
   }
</script>

<button
   type="button"
   class="text-purple-300 text-sm hover:underline underline-offset-2"
   on:click={() => {
      isModalOpened = true;
   }}
>
   Generate a strong password
</button>

<Dialog.Root
   isOpened={isModalOpened}
   closeDialog={() => {
      isModalOpened = false;
   }}
>
   <Dialog.Panel class="max-w-[36rem]">
      <Dialog.Title>Generate a strong password</Dialog.Title>

      <Dialog.Description>
         A strong and random password helps protect your online accounts and personal information from cyber threats
      </Dialog.Description>

      <Dialog.Description>
         By using a mix of characters and symbols, you can reduce the risk of unauthorized access and identity theft.
      </Dialog.Description>

      <Dialog.Description>Protect yourself by choosing a strong password.</Dialog.Description>

      <Dialog.Description class="dark:text-orange-300 text-orange-400 flex items-center gap-2">
         <AlertCircle size={24} class="dark:text-orange-300 text-orange-400" />
         Don&lsquo;t forget to save this password before create your account!
      </Dialog.Description>

      <div class="bg-gray-950 p-2 px-4 rounded-[10px] flex items-center justify-between mt-4 shadow-inner">
         <strong class="text-[1.5rem] font-bold tracking-widest text-white">
            {isPasswordVisible
               ? strongPassword
               : strongPassword
                    .split('')
                    .map(() => '*')
                    .join('')}
         </strong>

         <div class="flex items-center gap-3">
            <button
               type="button"
               on:click={() => {
                  isPasswordVisible = !isPasswordVisible;
               }}
               title="Show password"
               class="flex items-center justify-center w-fit"
            >
               {#if isPasswordVisible}
                  <EyeOff size={28} class="text-purple-300" />
               {:else}
                  <Eye size={28} class="text-purple-300" />
               {/if}
            </button>

            <button
               type="button"
               on:click={() => {
                  strongPassword = generatePassword();
               }}
               title="Regenerate the password"
               class="flex items-center justify-center w-fit active:scale-90 transition-all"
            >
               <RefreshCcw size={28} class="text-purple-300" />
            </button>
         </div>
      </div>

      <div class="flex gap-2 ml-auto">
         <button
            type="button"
            on:click={copyToClipboard}
            class="p-2 px-3 transition-all flex items-center gap-2 text-purple-300 tracking-wider text-md rounded-[6px] border-1 border-solid border-purple-500 hover:bg-purple-500 hover:text-white w-fit group"
         >
            {#if isCopied}
               <Check size={28} class="text-purple-300 group-hover:text-white" />
               Copied
            {:else}
               <Copy size={28} class="text-purple-300" />
               Copy
            {/if}
         </button>

         <button
            type="button"
            on:click={() => {
               setPasswordValue(strongPassword);
               isModalOpened = false;
            }}
            class="p-2 px-3 flex items-center gap-2 text-green-400 tracking-wider text-md rounded-[6px] border-1 border-solid border-green-400 w-fit hover:bg-green-700 hover:text-white hover:dark:text-white"
         >
            <Key size={28} class="text-green-400" />
            Use this password
         </button>
      </div>
   </Dialog.Panel>
</Dialog.Root>
