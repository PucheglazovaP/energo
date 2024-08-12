import { IMessage } from '@stomp/stompjs';
import { createEffect } from 'effector';

import { getInfoAboutTransparents } from '../../Const/Queries/formObjects';
import { rxStompRPC } from '../../packages/StompClient';
import { rpcEndPoint } from '../../packages/StompClient/createWSConnection';

import { setInformationAboutBanners } from './event';

export const fetchInfoAboutTransparentsFx = createEffect(
	({
		codeForm,
		codeVersion,
	}: {
		codeForm: number | null;
		codeVersion: number | null;
	}) => {
		rxStompRPC
			.rpc({
				destination: rpcEndPoint,
				body: JSON.stringify(getInfoAboutTransparents(codeForm, codeVersion)),
			})
			.subscribe(function (result: IMessage) {
				const response = JSON.parse(result.body).Response;
				const data = response.Tables[0].Rows;
				setInformationAboutBanners(data);
			});
	},
);
