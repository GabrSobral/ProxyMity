import { redirect } from '@sveltejs/kit';

/**
 * Middleware to check if the user is already logged in.
 * @param event Middleware event
 * @returns
 */
export async function load(event) {
	const session = await event.locals.auth();

	if (session) {
		redirect(303, '/');
	}

	return {};
}
