import Keycloak from 'keycloak-js';

import { TOKEN_VALIDITY } from './index';
import { parseCookies, setCookies } from './utils';

export const keycloakInstance: Keycloak.KeycloakInstance =
	new (Keycloak as any)({
		url: window.appConfig.KEYCLOAK_CONFIG_URL,
		realm: window.appConfig.KEYCLOAK_CONFIG_REALM,
		clientId: window.appConfig.KEYCLOAK_CONFIG_CLIENT_ID,
	});

export function initializeKeycloak(initializeApplication: () => void) {
	setInterval(() => {
		keycloakInstance.updateToken(TOKEN_VALIDITY).then(() => {
			setCookies(keycloakInstance, TOKEN_VALIDITY);
		});
	}, TOKEN_VALIDITY * 1000);

	const { kc_token, kc_refresh } = parseCookies(document.cookie);
	const redirectUri = window.location.href.concat('?');

	keycloakInstance
		.init({
			onLoad: 'check-sso',
			silentCheckSsoRedirectUri: `${window.location.origin}/silent-check-sso.html`,
			redirectUri: redirectUri,
			token: kc_token,
			refreshToken: kc_refresh,
		})
		.then((authenticated) => {
			if (!authenticated) {
				keycloakInstance.login();
			}
			keycloakInstance.updateToken(TOKEN_VALIDITY).then(() => {
				setCookies(keycloakInstance, TOKEN_VALIDITY);
			});
			initializeApplication();
		});
}
