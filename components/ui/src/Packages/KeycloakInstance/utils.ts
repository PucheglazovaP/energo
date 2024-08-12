import Keycloak from 'keycloak-js';

import { Role } from './types';

export function parseCookies(str: string) {
	if (!str) return {};
	return str
		.split(';')
		.map((v) => v.split('='))
		.reduce((acc, v) => {
			acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
			return acc;
		}, {} as Record<string, string>);
}
export function setCookies(
	keycloakInstance: Keycloak.KeycloakInstance,
	maxAge: number,
) {
	const domain = window.location.hostname;
	const { token, refreshToken } = keycloakInstance;
	document.cookie = `kc_token=${token}; max-age=${maxAge}; secure; path=/; domain=${domain}`;
	document.cookie = `kc_refresh=${refreshToken}; max-age=${maxAge}; secure; path=/; domain=${domain}`;
}

function getUserRole(userRoles: string[]): Role {
	const allowedGroups: string | undefined = import.meta.env.VITE_USER_ROLES;
	if (allowedGroups == null || userRoles == null) return Role.EM_VIEW;
	const [administratorGroup, analyticGroup, userGroup] =
		allowedGroups.split(',');

	if (userRoles.includes(administratorGroup)) return Role.EM_ADMIN;
	if (userRoles.includes(analyticGroup)) return Role.EM_ANALYTIC;
	if (userRoles.includes(userGroup)) return Role.EM_VIEW;
	return Role.EM_VIEW;
}

export default getUserRole;
