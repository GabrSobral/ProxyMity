import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import App from './pages/App';
import { SignIn } from './pages/sign-in';
import { SignUp } from './pages/sign-up';

import { UserProvider } from './contexts/user-context/context';

import './index.css';

const router = createBrowserRouter([
	{
		path: '/',
		element: <App />,
		index: true,
	},
	{
		path: '/sign-in',
		element: <SignIn />,
	},
	{
		path: '/sign-up',
		element: <SignUp />,
	},
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	// <React.StrictMode>
	<UserProvider>
		<RouterProvider router={router} />
	</UserProvider>
	// </React.StrictMode>
);
