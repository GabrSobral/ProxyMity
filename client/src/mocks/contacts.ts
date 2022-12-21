import { ContactDialog } from '../contexts/chat-context/reducers/contact-reducer';

export const contactsMock: ContactDialog[] = [
	{
		name: 'Osvaldo Martinez',
		email: 'Osvaldo_martinez@gmail.com',
		lastMessage: {
			date: new Date(),
			content: 'Iai mano, tranquilo?',
		},
		isOnline: false,
		registeredAt: new Date(),
	},
	{
		name: 'Dominique Rubens',
		email: 'Dominique_rubens@gmail.com',
		lastMessage: {
			date: new Date(),
			content: 'Bom dia, gostaria de ouvir a palavra de Jeová??',
		},
		isOnline: true,
		registeredAt: new Date(),
	},
	{
		name: 'Diogo',
		email: 'Diogo@gmail.com',
		lastMessage: null,
		isOnline: false,
		registeredAt: new Date(),
	},
];
