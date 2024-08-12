import { useMemo } from 'react';

import UserPopup from '../../Components/UserPopup';
import { useAppSelector } from '../../Hooks/Store/useAppSelector';
import { Role } from '../../Packages/KeycloakInstance/types';
import getUserRole from '../../Packages/KeycloakInstance/utils';
import { User } from '../../Shared/types';
import { convertUserToPeopleName } from '../../Shared/Utils/utils';
import { selectUser } from '../../Store/reducers/AuthSlice/authSelectors';

import styles from './UserInfo.module.css';

function UserInfo() {
	const userInfo: User | null = useAppSelector(selectUser);
	const roleName: string = useMemo(() => {
		const userRoles = userInfo?.roles?.map((item) => String(item.ROLE_NAME));
		const currentRole: Role = getUserRole(userRoles as string[]);
		switch (currentRole) {
			case Role.EM_ADMIN:
				return 'Администратор';
			case Role.EM_ANALYTIC:
				return 'Аналитик';
			case Role.EM_VIEW:
				return 'Гость';
			default:
				return 'Гость';
		}
	}, [userInfo]);
	return userInfo ? (
		<UserPopup>
			<div className={styles.username}>
				{convertUserToPeopleName(userInfo.preferredUsername)}
			</div>
			<div className={styles.role}>{roleName}</div>
		</UserPopup>
	) : null;
}

export default UserInfo;
