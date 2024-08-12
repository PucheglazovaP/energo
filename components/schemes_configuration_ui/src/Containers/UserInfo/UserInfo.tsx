import { useMemo } from 'react';
import { useStore } from 'effector-react';

import UserPopup from '../../Containers/UserPopup';
import { $roles, $user } from '../../Models/Auth';
import { checkAccess } from '../../packages/KeycloakInstance/utils';
import { Role } from '../../Shared/types';
import { convertUserToPeopleName } from '../../Utils/convertUserToPeopleName';

import styles from './UserInfo.module.css';

function UserInfo() {
	const roles = useStore($roles);
	const userInfo = useStore($user);

	const roleName: string = useMemo(() => {
		if (checkAccess(roles, Role.EM_ADMIN)) {
			return 'Администратор';
		}
		if (checkAccess(roles, Role.EM_ANALITIC)) {
			return 'Аналитик';
		}
		return 'Гость';
	}, [roles]);

	return userInfo && roles.length ? (
		<UserPopup>
			<div className={styles.username}>
				{convertUserToPeopleName(userInfo.preferredUsername)}
			</div>
			<div className={styles.role}>{roleName}</div>
		</UserPopup>
	) : null;
}

export default UserInfo;
