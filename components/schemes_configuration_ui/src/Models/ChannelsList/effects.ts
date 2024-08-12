import { toast } from 'react-toastify';
import { createEffect } from 'effector';

import { channelsListAdapter } from '../../Adapters/channelsListAdapter';
import { fetchChannelsListQuery } from '../../Const/Queries/channelsList';
import { RpcError, rpcQuery } from '../../Utils/requests';

import { ChannelsList } from './types';

// Получение списка каналов
export const fetchChannelsListFx = createEffect(async () => {
	try {
		const channelsList = await rpcQuery<ChannelsList[]>(
			fetchChannelsListQuery(),
			channelsListAdapter,
		);

		return channelsList;
	} catch (err) {
		if (err instanceof RpcError) {
			err.toastMessage();
		} else {
			toast.error('Что-то пошло не так c получением списка каналов');
		}

		return [];
	}
});
