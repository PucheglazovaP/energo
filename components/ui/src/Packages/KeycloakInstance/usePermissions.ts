import { useMemo } from 'react';

import { useAppSelector } from '../../Hooks/Store/useAppSelector';
import { selectUser } from '../../Store/reducers/AuthSlice/authSelectors';

import * as permissions from './permissions';
import { Permissions, Role } from './types';
import getUserRole from './utils';

export function usePermissions(): Permissions {
	const user = useAppSelector(selectUser);
	const userRoles = useMemo(
		() => user?.roles?.map((item) => String(item.ROLE_NAME)),
		[user?.roles],
	);

	return useMemo(() => {
		const role: Role = getUserRole(userRoles as string[]);
		switch (role) {
			case Role.EM_ADMIN:
				return permissions.administratorPermissions;
			case Role.EM_ANALYTIC:
				return permissions.analyticPermissions;
			case Role.EM_VIEW:
				return permissions.viewerPermissions;
			default:
				return permissions.viewerPermissions;
		}
	}, [userRoles]);
}

export default usePermissions;
