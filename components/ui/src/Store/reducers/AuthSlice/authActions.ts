import { IMessage } from '@stomp/stompjs';

import { convertOriginUserInfoToUser } from '../../../Adapters/loadUserInfo';
import keycloak from '../../../Packages/KeycloakInstance/keycloakInstance';
import { User, UserResponse } from '../../../Shared/types';
import { rpcEndPoint } from '../../../WebSocket';
import { AppDispatch, RootState, rxStompRPC } from '../../store';

import { userRolesQuery } from './queries/userRolesQuery';
import { setUserInfo } from './AuthSlice';

export const getUserInfo = async (dispatch: AppDispatch) => {
	const userInfo: UserResponse | null =
		(await keycloak.loadUserInfo()) as UserResponse;
	if (userInfo == null) return null;
	dispatch(setUserInfo(convertOriginUserInfoToUser(userInfo)));
};

export const getUserRoles =
	() => (dispatch: AppDispatch, getState: () => RootState) => {
		const user = getState().authReducer.user;
		try {
			rxStompRPC
				.rpc({
					destination: rpcEndPoint,
					body: JSON.stringify(
						userRolesQuery({ userId: String(user?.preferredUsername) }),
					),
				})
				.subscribe(function (result: IMessage) {
					const resultData = JSON.parse(result.body).Response.Tables[0].Rows;
					dispatch(setUserInfo({ ...user, roles: resultData } as User));
				});
		} catch (e) {
			console.log(e);
		}
	};
