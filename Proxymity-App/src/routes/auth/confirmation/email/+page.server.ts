import { redirect } from '@sveltejs/kit';

import { confirmEmailAsync } from '$lib/modules/authentication/services/confirm-email-async.js';

import { logError } from '../../../../utils/logging.js';

/**
 * Middleware to check if the user is already logged in.
 * @param event Middleware event
 * @returns
 */
export async function load(event) {
   const session = await event.locals.auth();

   if (session?.user) {
      redirect(303, '/chat');
   }

   const token = event.url.searchParams.get('token');
   let isConfirmed = false;
   let errorMessage = '';

   try {
      await confirmEmailAsync({ token: token || '' }, { accessToken: session?.accessToken });

      isConfirmed = true;
   } catch (error: any) {
      logError(error);
      errorMessage = error?.response?.data;
   }

   return { isConfirmed, error: errorMessage };
}
