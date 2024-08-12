import { createEffect } from 'effector';

import { getUserRolesAdapter } from '../../Adapters/getUserRolesAdapter';
import { getUserRolesQuery } from '../../Const/Queries/getUserRolesQuery';
import { Role, User } from '../../Shared/types';
import { rpcQuery } from '../../Utils/requests';

export const loadUserInfoFx = createEffect<void, User | null>({
	name: 'Loaded user info',
});

export const getAuthenticationFx = createEffect<void, boolean>({
	name: 'Authentication state',
});

// Запрос ролей пользователя
export const loadUserRolesFx = createEffect(async (user: User | null) => {
	const userRoles = await rpcQuery<Role[]>(
		getUserRolesQuery({ userId: String(user?.preferredUsername) }),
		getUserRolesAdapter,
	);
	return userRoles;
});
