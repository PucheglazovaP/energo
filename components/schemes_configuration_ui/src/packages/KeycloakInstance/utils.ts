import Keycloak from 'keycloak-js';

import { Role } from '../../Shared/types';

import { Permissions } from './types';

// It's mutable for a reason
export function addPermission(
	permissions: Set<Permissions>,
	newPermissions: Permissions[],
): void {
	newPermissions.forEach((permission) => {
		permissions.add(permission);
	});
}

export function checkPermission(
	permissions: Permissions[],
	allowed: Permissions,
): boolean {
	return permissions.indexOf(allowed) !== -1;
}

export function checkAccess(roles: Role[], accessor: Role) {
	return roles.includes(accessor);
}

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
