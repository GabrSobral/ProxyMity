import { superValidate } from 'sveltekit-superforms/server';
import { fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { appearanceFormSchema } from '$lib/modules/settings/pages/appearance/components/AppearanceForm.svelte';

export const load: PageServerLoad = async () => {
   return {
      form: await superValidate(appearanceFormSchema),
   };
};

export const actions: Actions = {
   default: async event => {
      const form = await superValidate(event, appearanceFormSchema);
      if (!form.valid) {
         return fail(400, {
            form,
         });
      }
      return {
         form,
      };
   },
};
