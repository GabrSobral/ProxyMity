<script lang="ts">
   import Eye from 'phosphor-svelte/lib/Eye';
   import Key from 'phosphor-svelte/lib/Key';
   import Copy from 'phosphor-svelte/lib/Copy';
   import Check from 'phosphor-svelte/lib/Check';
   import Warning from 'phosphor-svelte/lib/Warning';
   import EyeClosed from 'phosphor-svelte/lib/EyeClosed';
   import ArrowClockwise from 'phosphor-svelte/lib/ArrowsClockwise';

   import Dialog from '$lib/design-system/Dialog/Dialog.svelte';

   export let isVisible = false;
   export let closeModal: () => void;
   export let setPasswordValue: (newPassword: string) => void;

   let strongPassword = generatePassword();
   let isPasswordVisible = false;
   let isCopied = false;

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

<Dialog let:Description let:Title show={isVisible} {closeModal} className="gap-3 max-w-[36rem]">
   <Title>Generate a strong password</Title>

   <Description>
      A strong and random password helps protect your online accounts and personal information from cyber threats
   </Description>

   <Description>
      By using a mix of characters and symbols, you can reduce the risk of unauthorized access and identity theft.
   </Description>

   <Description>Protect yourself by choosing a strong password.</Description>

   <Description className="dark:text-orange-300 text-orange-400 flex items-center gap-2">
      <Warning size={24} class="dark:text-orange-300 text-orange-400" />
      Don&lsquo;t forget to save this password before create your account!
   </Description>

   <div
      class="dark:bg-gray-950 bg-gray-100 p-2 px-4 rounded-[10px] flex items-center justify-between mt-4 shadow-inner"
   >
      <strong class="text-[1.5rem] font-bold tracking-widest dark:text-white text-gray-700">
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
               <EyeClosed size={28} class="dark:text-purple-300 text-purple-500" />
            {:else}
               <Eye size={28} class="dark:text-purple-300 text-purple-500" />
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
            <ArrowClockwise size={28} class="dark:text-purple-300 text-purple-500" />
         </button>
      </div>
   </div>

   <div class="flex gap-2 ml-auto">
      <button
         type="button"
         on:click={copyToClipboard}
         class="p-2 px-3 transition-all flex items-center gap-2 dark:text-purple-300 text-purple-500 tracking-wider text-md rounded-[10px] border-2 border-solid border-purple-500 w-fit"
      >
         {#if isCopied}
            <Check size={28} class="dark:text-purple-300 text-purple-500" />
            Copied
         {:else}
            <Copy size={28} class="dark:text-purple-300 text-purple-500" />
            Copy
         {/if}
      </button>

      <button
         type="button"
         on:click={() => {
            setPasswordValue(strongPassword);
            closeModal();
         }}
         class="p-2 px-3 flex items-center gap-2 dark:text-green-400 text-green-700 tracking-wider text-md rounded-[10px] border-2 border-solid dark:border-green-400 border-green-700 w-fit"
      >
         <Key size={28} class="dark:text-green-400 text-green-700" />
         Use this password
      </button>
   </div>
</Dialog>
