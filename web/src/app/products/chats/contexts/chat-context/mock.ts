import { Contact } from '@/types/contact';

export const contactsMock: Contact[] = [
	{
		id: '9f22a5d7-d8f6-4b5d-b8e1-aaa74e104fd5',
		name: 'Javascript',
		email: 'javascript@gmail.com',
		createdAt: new Date(),
		lastOnline: new Date(),
		photoUrl: 'https://github.com/GabrSobral.png',
		registeredAt: new Date(),
		status: 'online',
	},
	{
		id: 'caeb3473-d547-4516-8ac0-73b364690d9a',
		name: 'Typescript',
		email: 'typescript@email.com',
		createdAt: new Date(),
		lastOnline: new Date(),
		photoUrl: 'https://github.com/diego3g.png',
		registeredAt: new Date(),
		status: 'busy',
	},
	{
		id: '3',
		name: 'Rodrigo Silva',
		email: 'rodrigo@silva.com',
		createdAt: new Date(),
		lastOnline: new Date(),
		photoUrl: 'https://github.com/rodrigorgtic.png',
		registeredAt: new Date(),
		status: 'online',
	},
];
