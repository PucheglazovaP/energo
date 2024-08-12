import { convertOriginUserInfoToUser } from '../../Adapters/loadUserInfo';
import { User, UserResponse } from '../../Shared/types';

import keycloak from './keycloakInstance';
import { parseCookies, setCookies } from './utils';
export const TOKEN_VALIDITY = 60;
export async function initKeycloak() {
	setInterval(() => {
		keycloak.updateToken(TOKEN_VALIDITY).then(() => {
			setCookies(keycloak, TOKEN_VALIDITY);
		});
	}, TOKEN_VALIDITY * 1000);

	const { kc_token, kc_refresh } = parseCookies(document.cookie);
	const redirectUri = window.location.href.concat('?');
	await keycloak
		.init({
			onLoad: 'check-sso',
			silentCheckSsoRedirectUri: `${window.location.origin}/silent-check-sso.html`,
			redirectUri: redirectUri,
			token: kc_token,
			refreshToken: kc_refresh,
		})
		.then((authenticated) => {
			if (!authenticated) {
				keycloak.login();
			}
			keycloak.updateToken(TOKEN_VALIDITY).then(() => {
				setCookies(keycloak, TOKEN_VALIDITY);
			});
		});
}

export async function getUserInfo(): Promise<User | null> {
	const userInfo: UserResponse | null =
		(await keycloak.loadUserInfo()) as UserResponse;
	if (userInfo == null) return null;
	return convertOriginUserInfoToUser(userInfo);
}
