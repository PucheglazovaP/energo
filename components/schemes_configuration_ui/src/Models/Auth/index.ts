import { createStore, sample } from 'effector';

import {
	getIsAuthenticated,
	getUserInfo,
} from '../../packages/KeycloakInstance';
import { Role, User } from '../../Shared/types';
import { fetchAssignedEmergencyEventsNumberFx } from '../EmergencyEvents/effects';

import {
	getAuthenticationFx,
	loadUserInfoFx,
	loadUserRolesFx,
} from './effects';
import { getAuthentication, loadUserInfo, setRoles } from './events';

export const $user = createStore<User | null>(null, {
	name: 'User data store',
});

export const $isAuthenticated = createStore<boolean>(false, {
	name: 'Is authenticated',
});

export const $roles = createStore<Role[]>([], {
	name: 'User roles',
});

getAuthenticationFx.use(getIsAuthenticated);

loadUserInfoFx.use(getUserInfo);

$user.on(loadUserInfoFx.doneData, (state, user) => {
	if (JSON.stringify(state) === JSON.stringify(user)) return state;
	return user;
});

$isAuthenticated.on(getAuthenticationFx.doneData, (state, isAuthenticated) => {
	if (JSON.stringify(state) === JSON.stringify(isAuthenticated)) return state;
	return isAuthenticated;
});

$roles.on(setRoles, (_state, userRoles) => {
	return userRoles;
});

sample({ clock: getAuthentication, target: getAuthenticationFx });

sample({
	source: $isAuthenticated,
	filter: (isAuthenticated) => isAuthenticated,
	target: loadUserInfo,
});

sample({ clock: loadUserRolesFx.doneData, target: setRoles });

sample({ source: loadUserInfo, target: loadUserInfoFx });

sample({
	source: $user,
	target: loadUserRolesFx,
});
sample({
	source: $user,
	fn: (user) => {
		return { userId: user?.preferredUsername || '' };
	},
	target: fetchAssignedEmergencyEventsNumberFx,
});
