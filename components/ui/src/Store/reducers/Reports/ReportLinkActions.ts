import { IMessage } from '@stomp/stompjs';

import { BackendResponse } from '../../../Types/RpcResponseTypes';
import { rpcEndPoint } from '../../../WebSocket';
import { rxStompRPC } from '../../store';

import { getReportLink } from './queries';

export const getReportLinkPromise = (groupId: number): Promise<string> => {
	const observable = rxStompRPC.rpc({
		destination: rpcEndPoint,
		body: JSON.stringify(getReportLink(groupId)),
	});
	return new Promise((resolve, reject) =>
		observable.subscribe((response: IMessage) => {
			try {
				let result = '';
				const { Response }: BackendResponse = JSON.parse(response.body);
				const urlResponse = Response.Tables[0]?.Rows as { RepURL: string }[];
				if (urlResponse[0])
					result = decodeURI(urlResponse[0].RepURL).split('&')[0];
				resolve(result);
			} catch (_err) {
				reject(_err);
			}
		}),
	);
};
