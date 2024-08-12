import { convertOriginUserInfoToUser } from '../../Adapters/loadUserInfo';
import { LOCAL_USER } from '../../Shared/const';
import { User, UserResponse } from '../../Shared/types';
import { checkSkipAuth } from '../../Utils/auth';

import { keycloakInstance } from './keycloakInstance';

export const TOKEN_VALIDITY = 60;
export async function getIsAuthenticated(): Promise<boolean> {
	if (checkSkipAuth()) return true;
	return keycloakInstance.authenticated || false;
}

export async function getUserInfo(): Promise<User | null> {
	if (checkSkipAuth()) return LOCAL_USER;
	const userInfo: UserResponse | null =
		(await keycloakInstance.loadUserInfo()) as UserResponse;
	if (userInfo == null) return null;
	return convertOriginUserInfoToUser(userInfo);
}
