import { IMessage } from '@stomp/stompjs';

import { rpcEndPoint } from '../../../WebSocket';
import { AppDispatch, RootState, rxStompRPC } from '../../store';

import { convertUserGroups } from './converters';
import { userGroupsQuery } from './queries';
import { setUserGroups } from './UserGroupsSlice';

export const getUserGroups =
	() => (dispatch: AppDispatch, getState: () => RootState) => {
		const userId = getState().authReducer.user?.preferredUsername;
		try {
			rxStompRPC
				.rpc({
					destination: rpcEndPoint,
					body: JSON.stringify(userGroupsQuery({ userId: String(userId) })),
				})
				.subscribe(function (result: IMessage) {
					const resultData = JSON.parse(result.body).Response.Tables[0].Rows;
					const userGroups = convertUserGroups(resultData);
					dispatch(setUserGroups(userGroups));
				});
		} catch (e) {
			console.log(e);
		}
	};
