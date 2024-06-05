<script lang="ts">
   import { page } from '$app/stores';
   import { goto } from '$app/navigation';
   import { signIn } from '@auth/sveltekit/client';

   let { children } = $props();

   let isSignInPage = $state($page.url.pathname.includes('sign-in'));

   $effect(() => {
      isSignInPage = $page.url.pathname.includes('sign-in');
   });

   async function oauthProvider(provider: 'github') {
      try {
         await signIn(provider, { redirect: false, callbackUrl: '/chat' });
         goto('/chat');
      } catch (error: any) {
         console.log({ error });
      }
   }
</script>

<main
   class="flex-1 flex-col gap-4 flex items-center justify-center bg-[url('/sign-background.svg')] bg-no-repeat bg-cover relative bg-black"
>
   <div
      class="p-4 duration-300 rounded-[1rem] mt-12 ring-1 ring-gray-700 w-96 flex flex-col gap-4 shadow-lg bg-gray-800/40 backdrop-blur-sm transition-all max-h-full"
   >
      <header class="flex items-center justify-center relative h-[80px]">
         <img src="/Logo.svg" alt="ProxyMity Logo" width={170} height={170} class="absolute -top-[5rem]" />
      </header>

      <div class="flex w-full bg-gray-900 relative rounded-full shadow-inner transition-colors">
         <div
            data-signin={isSignInPage}
            data-signup={!isSignInPage}
            class="absolute h-[80%] -translate-y-2/4 top-2/4 w-[calc(50%-12px)] rounded-full z-20 gradient transition-all shadow-lg duration-300 data-[signin=true]:left-[6px] data-[signup=true]:left-[calc(50%+6px)]"
         ></div>

         <a
            tabindex="-1"
            href="/auth/sign-in"
            title="Log In Page"
            data-sveltekit-preload-data="hover"
            class="flex items-center flex-1 text-white font-medium text-lg whitespace-nowrap p-3 rounded-[10px] justify-center z-30 tracking-widest"
         >
            Log In
         </a>

         <a
            tabindex="-1"
            href="/auth/sign-up"
            title="Register page"
            data-sveltekit-preload-data="hover"
            class="flex items-center flex-1 text-white font-medium text-lg whitespace-nowrap p-3 rounded-[10px] justify-center z-30 tracking-widest"
         >
            Register
         </a>
      </div>

      <div class="overflow-hidden p-1 flex items-center justify-center flex-1 flex-col">
         {@render children()}

         <div class="flex flex-col gap-4 w-full m-4">
            <span class="flex w-full items-center gap-2 whitespace-nowrap text-white">
               <div class="w-full h-[1px] bg-gray-500"></div>
               Or sign in with
               <div class="w-full h-[1px] bg-gray-500"></div>
            </span>

            <button
               onclick={() => {
                  oauthProvider('github');
               }}
               type="button"
               title="Sign in with Github"
               class="rounded-[8px] border hover:brightness-125 transition-all hover:bg-gray-950 border-gray-600 p-2 bg-black w-full text-white flex items-center justify-center gap-3"
            >
               <svg width="26" height="25" viewBox="0 0 26 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                     fill-rule="evenodd"
                     clip-rule="evenodd"
                     d="M13.0108 0C5.81614 0 0 5.72914 0 12.8169C0 18.4825 3.7266 23.2783 8.89639 24.9757C9.54275 25.1033 9.77951 24.6999 9.77951 24.3606C9.77951 24.0634 9.7582 23.045 9.7582 21.9838C6.13892 22.7478 5.38524 20.4559 5.38524 20.4559C4.8036 18.9705 3.94179 18.5887 3.94179 18.5887C2.7572 17.8036 4.02808 17.8036 4.02808 17.8036C5.3421 17.8885 6.0316 19.1192 6.0316 19.1192C7.19461 21.0713 9.0687 20.5197 9.82265 20.1801C9.93024 19.3525 10.2751 18.7796 10.6413 18.4614C7.75468 18.1642 4.71758 17.0609 4.71758 12.1377C4.71758 10.7372 5.23424 9.59137 6.0529 8.70022C5.92374 8.382 5.47126 7.06612 6.18233 5.30493C6.18233 5.30493 7.2809 4.96534 9.75793 6.62055C10.8184 6.33999 11.9121 6.19727 13.0108 6.19607C14.1093 6.19607 15.2292 6.34477 16.2633 6.62055C18.7406 4.96534 19.8392 5.30493 19.8392 5.30493C20.5503 7.06612 20.0975 8.382 19.9683 8.70022C20.8086 9.59137 21.3039 10.7372 21.3039 12.1377C21.3039 17.0609 18.2668 18.1429 15.3586 18.4614C15.8327 18.8645 16.2417 19.6283 16.2417 20.8379C16.2417 22.5567 16.2204 23.9361 16.2204 24.3603C16.2204 24.6999 16.4575 25.1033 17.1035 24.9759C22.2733 23.278 25.9999 18.4825 25.9999 12.8169C26.0212 5.72914 20.1838 0 13.0108 0Z"
                     fill="white"
                  />
               </svg>

               Github
            </button>
         </div>
      </div>
   </div>

   <span class="text-gray-200">© {new Date().getFullYear()} ProxyMity. All rights reserved.</span>
</main>
