import { createEffect } from 'effector';

import serversListAdapter from '../../Adapters/serversAdapter';
import { getServersQuery } from '../../Const/Queries';
import { handleError } from '../../Utils/handleToast';
import { rpcQuery } from '../../Utils/requests';

import { setServersIsLoading, setServersList } from './events';
import { Server } from './types';

export const getServersListFx = createEffect(async (userId: string) => {
	const servers = await rpcQuery<Server[]>(
		getServersQuery(userId),
		serversListAdapter,
	);
	return servers;
});

getServersListFx.done.watch(({ result }) => {
	setServersList(result);
});

getServersListFx.fail.watch(({ error }) => {
	handleError(error);
});

getServersListFx.pending.watch((pending) => {
	if (pending) {
		setServersIsLoading(true);
	}
});

getServersListFx.finally.watch(() => {
	setServersIsLoading(false);
});
