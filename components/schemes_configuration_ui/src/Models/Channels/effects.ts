import { createEffect } from 'effector';

import { channelsAdapter } from '../../Adapters/channelsAdapter';
import { getChannelsListQuery } from '../../Const/Queries/channels';
import { ChannelsParams, OptimizedPagination } from '../../Shared/types';
import { handleError } from '../../Utils/handleToast';
import { rpcQuery } from '../../Utils/requests';

import {
	addChannelsList,
	setChannelsIsLoading,
	setChannelsList,
	setChannelsPagination,
} from './events';
import { Channel } from './types';

export const getChannelsListFx = createEffect(
	async (params: ChannelsParams) => {
		const { channels, pagination } = await rpcQuery<{
			channels: Channel[];
			pagination: OptimizedPagination;
		}>(getChannelsListQuery(params), channelsAdapter);
		return { channels, pagination };
	},
);

getChannelsListFx.done.watch(({ result, params }) => {
	const { operation } = params;
	if (operation === 'add') {
		addChannelsList(result.channels);
		return;
	}
	setChannelsList(result.channels);
	setChannelsPagination(result.pagination);
});

getChannelsListFx.fail.watch(({ error }) => {
	handleError(error);
});

getChannelsListFx.pending.watch((pending) => {
	if (pending) {
		setChannelsIsLoading(true);
	}
});

getChannelsListFx.finally.watch(() => {
	setChannelsIsLoading(true);
});
