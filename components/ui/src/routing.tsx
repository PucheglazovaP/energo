import { createBrowserRouter as createRouter } from 'react-router-dom';

import PageError from './Pages/PageError';
import PageHome from './Pages/PageHome';
import { RouteItem } from './Shared/types';
import App from './App';

const routes: RouteItem[] = [
	{
		index: true,
		displayName: 'Конфигуратор тэгов',
		key: 'home',
		element: <PageHome />,
	},
];

export default createRouter([
	{
		path: '/',
		element: <App />,
		errorElement: <PageError />,
		children: routes,
	},
]);
