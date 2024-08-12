import { toast } from 'react-toastify';
import { createEffect } from 'effector';

import { fetchChannelsDiagnosticAdapter } from '../../Adapters/diagnosticAdapters';
import { fetchChannelsDiagnosticQuery } from '../../Const/Queries/diagnosticQueries';
import { FetchChannelsDiagnosticParams } from '../../Shared/types';
import { RpcError, rpcQuery } from '../../Utils/requests';

import { Channel } from './types';

export const fetchChannelsDiagnosticFx = createEffect(
	async (params: FetchChannelsDiagnosticParams) => {
		try {
			const channels: Channel[] = await rpcQuery<Channel[]>(
				fetchChannelsDiagnosticQuery(params),
				fetchChannelsDiagnosticAdapter,
			);
			return channels;
		} catch (err) {
			if (err instanceof RpcError) {
				err.toastMessage();
			} else {
				toast.error(
					'Что-то пошло не так при получении поканальной диагностики',
				);
			}
		}
		return [];
	},
);
