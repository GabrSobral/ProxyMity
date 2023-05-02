import { UserImage } from '@/@design-system/UserImage';

import { useContactStore } from '@/stores/contacts';

export function OnlineNow() {
	const selectContact = useContactStore(store => store.actions.selectContact);
	const contacts = useContactStore(store => store.state.contacts);

	return (
		<section className="relative flex flex-col gap-3 bg-gray-900 rounded-[10px] p-3">
			<h2 className="text-lg font-semibold text-white tracking-wide">Online now (3)</h2>

			<div className="relative">
				<ul className="flex gap-2 max-w-full overflow-x-scroll">
					{contacts.map(contact => (
						<li key={contact.id} className="cursor-pointer group  min-w-[70px]">
							<button
								type="button"
								title={`Chat with ${contact.name}`}
								className="flex flex-col items-center overflow-hidden w-full p-1"
								onClick={() => selectContact(contact)}
							>
								<UserImage
									src={contact.photoUrl || ''}
									alt="Alt Text"
									status={contact.status as any}
									containerClassName="min-w-[60px] min-h-[60px] max-w-[60px] max-h-[60px] relative group-hover:ring-2 p-1 px-2 ring-purple-500 rounded-full transition-all flex items-center justify-center group-hover:underline"
								/>

								<span className="group-hover:underline text-sm mx-auto text-gray-200 mt-1 truncate flex overflow-hidden">
									{contact.name.split(' ')[0]}
								</span>
							</button>
						</li>
					))}
				</ul>

				<div className="absolute inset-y-0 right-0 w-10 z-10 bg-gradient-to-l from-gray-900" />
			</div>
		</section>
	);
}
