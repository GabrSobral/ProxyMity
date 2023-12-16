import { redirect } from '@sveltejs/kit';

export async function load(event) {
	if (!event?.locals?.getSession) {
		return {};
	}

	const session = await event.locals.getSession();

	if (session?.user) {
		redirect(303, '/chat');
	}

	return {};
}
