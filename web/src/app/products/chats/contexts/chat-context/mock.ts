import { Contact } from '@/types/contact';

export const contactsMock: Contact[] = [
	{
		id: '1',
		name: 'Gabriel Sobral',
		email: 'gabriel@sobral.com',
		createdAt: new Date(),
		lastOnline: new Date(),
		photoUrl: 'https://github.com/GabrSobral.png',
		registeredAt: new Date(),
		status: 'online',
	},
	{
		id: '2',
		name: 'Diego Fernandes',
		email: 'dFernandes@email.com',
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
