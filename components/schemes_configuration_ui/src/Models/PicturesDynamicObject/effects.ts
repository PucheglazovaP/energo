import { IMessage } from '@stomp/stompjs';
import { createEffect } from 'effector';

import { getSetPicturesDynamicObject } from '../../Const/Queries/getSetPicturesDynamicObject';
import { rxStompRPC } from '../../packages/StompClient';
import { rpcEndPoint } from '../../packages/StompClient/createWSConnection';

import { setPicturesDynamicObject } from './event';

export const fetchPicturesDynamicObjectFx = createEffect(
	({
		codeForm,
		codeObject,
		nameParameter,
	}: {
		codeForm: number | null;
		codeObject: number;
		nameParameter: string;
	}) => {
		rxStompRPC
			.rpc({
				destination: rpcEndPoint,
				body: JSON.stringify(
					getSetPicturesDynamicObject(codeForm, codeObject, nameParameter),
				),
			})
			.subscribe(function (result: IMessage) {
				const response = JSON.parse(result.body).Response;
				const data = response.Tables[0].Rows;
				setPicturesDynamicObject(data);
			});
	},
);
