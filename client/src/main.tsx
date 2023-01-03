import ReactDOM from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import App from './pages/App';
import { SignIn } from './pages/sign-in';
import { SignUp } from './pages/sign-up';

import { UserProvider } from './contexts/user-context/context';
import { getToken } from './services/token/handler';

import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	// <React.StrictMode>
	<UserProvider>
		<BrowserRouter>
			<Routes>
				<Route element={getToken() ? <App /> : <Navigate replace to="/sign-in" />} path="/" index />
				<Route element={!getToken() ? <SignIn /> : <Navigate replace to="/" />} path="/sign-in" />
				<Route element={!getToken() ? <SignUp /> : <Navigate replace to="/" />} path="/sign-up" />
			</Routes>
		</BrowserRouter>
	</UserProvider>
	// </React.StrictMode>
);
