import { IMessage } from '@stomp/stompjs';

import { rpcEndPoint } from '../../../WebSocket';
import { AppDispatch, rxStompRPC } from '../../store';

import { setParametersNumber } from './DuplicatesSlice';
import { duplicatesQuery } from './queries';
import { DuplicatesQuery } from './types';

export const getDuplicatesRpc =
	(params: DuplicatesQuery) => (dispatch: AppDispatch) => {
		rxStompRPC
			.rpc({
				destination: rpcEndPoint,
				body: JSON.stringify(duplicatesQuery(params)),
			})
			.subscribe((response: IMessage) => {
				const parsedResponse = JSON.parse(response.body).Response;
				const data = parsedResponse.Tables[0].Rows;
				dispatch(setParametersNumber(data));
			});
	};
