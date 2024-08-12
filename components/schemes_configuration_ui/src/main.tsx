import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';

import { initializeKeycloak } from './packages/KeycloakInstance/keycloakInstance';
import { checkSkipAuth } from './Utils/auth';
import routes from './routing';

import './index.css';

function initializeApplication() {
	ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
		<React.StrictMode>
			<RouterProvider router={routes} />
		</React.StrictMode>,
	);
	/* 		<RouterProvider router={routes} />, */
}

if (checkSkipAuth()) {
	initializeApplication();
} else {
	initializeKeycloak(initializeApplication);
}
