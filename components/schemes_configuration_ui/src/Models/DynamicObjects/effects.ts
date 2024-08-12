import { IMessage } from '@stomp/stompjs';
import { createEffect } from 'effector';

import { getInfoAboutDynamicObjects } from '../../Const/Queries/formObjects';
import { rxStompRPC } from '../../packages/StompClient';
import { rpcEndPoint } from '../../packages/StompClient/createWSConnection';

import { setDynamicObjects } from './event';

export const fetchInfoAboutDynamicObjectsFx = createEffect(
	({
		codeForm,
		codeVersion,
	}: {
		codeForm: number | null;
		codeVersion: number;
	}) => {
		rxStompRPC
			.rpc({
				destination: rpcEndPoint,
				body: JSON.stringify(getInfoAboutDynamicObjects(codeForm, codeVersion)),
			})
			.subscribe(function (result: IMessage) {
				const response = JSON.parse(result.body).Response;
				const data = response.Tables[0].Rows;
				setDynamicObjects(data);
			});
	},
);
