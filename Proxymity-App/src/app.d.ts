/* eslint-disable @typescript-eslint/no-unused-vars */
// See https://kit.svelte.dev/docs/types#app

// for information about these interfaces
declare global {
   namespace App {
      // interface Error {}
      // interface Locals {}
      interface PageData {}
      interface Platform {
         env: {
            AUTH_SECRET: string;
         };
      }
   }

   namespace svelte.JSX {
      interface HTMLAttributes<T> {
         'on:click_outside'?: (event: CustomEvent) => void;
      }
   }
}
export {};
