import { createEffect } from 'effector';

import getAvailableFiltersNSIAdapter from '../../Adapters/getAvailableFiltersNSIAdapter';
import getFilteredDevicesListAdapter from '../../Adapters/getFilteredDevicesListAdapter';
import { getFilteredDevicesListQuery } from '../../Const/Queries';
import { getAvailableFiltersNSIQuery } from '../../Const/Queries/treeNSIFilterQueries';
import {
	AvailableFiltersByObjectTypes,
	AvailableFiltersNSIParams,
	FilteredDevicesParams,
} from '../../Shared/types';
import { rpcQuery } from '../../Utils/requests';

export const getAvailableFiltersNSIFx = createEffect<
	AvailableFiltersNSIParams,
	AvailableFiltersByObjectTypes
>('Get device id by equipment number', {
	handler: async (params) => {
		const response = await rpcQuery<AvailableFiltersByObjectTypes>(
			getAvailableFiltersNSIQuery(params),
			getAvailableFiltersNSIAdapter,
		);

		return response;
	},
});
export const getFilteredDevicesListFx = createEffect<
	FilteredDevicesParams,
	string
>('Get device id by equipment number', {
	handler: async (params) => {
		const response = await rpcQuery<string>(
			getFilteredDevicesListQuery(params),
			getFilteredDevicesListAdapter,
		);

		return response || '';
	},
});
