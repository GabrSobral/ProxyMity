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
	},
	{
		name: 'Dominique Rubens',
		email: 'Dominique_rubens@gmail.com',
		lastMessage: {
			date: new Date(),
			content: 'Bom dia, gostaria de ouvir a palavra de Jeová??',
		},
		isOnline: true,
	},
	{
		name: 'Diogo',
		email: 'Diogo@gmail.com',
		lastMessage: null,
		isOnline: false,
	},
];
