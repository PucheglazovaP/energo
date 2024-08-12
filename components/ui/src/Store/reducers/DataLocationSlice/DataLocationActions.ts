import { IMessage } from '@stomp/stompjs';

import { rpcEndPoint } from '../../../WebSocket';
import { AppDispatch, rxStompRPC } from '../../store';

import { setParametersNumber } from './DatalocationSlice';
import { channelsLocationQuery } from './queries';
import { ChannelsLocationQuery } from './types';

export const getDataLocationRpc =
	(params: ChannelsLocationQuery) => (dispatch: AppDispatch) => {
		rxStompRPC
			.rpc({
				destination: rpcEndPoint,
				body: JSON.stringify(channelsLocationQuery(params)),
			})
			.subscribe((response: IMessage) => {
				const parsedResponse = JSON.parse(response.body).Response;
				const data = parsedResponse.Tables[0].Rows;
				dispatch(setParametersNumber(data));
			});
	};
