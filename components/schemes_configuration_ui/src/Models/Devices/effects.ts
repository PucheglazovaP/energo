import { toast } from 'react-toastify';
import { createEffect } from 'effector';

import { devicesGroupsArchiveAdapter } from '../../Adapters/devices/devicesGroupsArchiveAdapter';
import { devicesAdapter } from '../../Adapters/devicesAdapter';
import { getDevicesListQuery } from '../../Const/Queries';
import { getDevicesGroupsArchiveRepQuery } from '../../Const/Queries/deviceParameters';
import { fetchDevicesURSV510Query } from '../../Const/Queries/printFormsQueries';
import {
	DeviceArchiveParams,
	DevicesParams,
	FetchDevicesResponse,
	FetchDevicesURSV510Params,
	OptimizedPagination,
} from '../../Shared/types';
import { handleError } from '../../Utils/handleToast';
import { RpcError, rpcQuery } from '../../Utils/requests';

import {
	setDevicesIsLoading,
	setDevicesList,
	setDevicesPagination,
} from './events';
import { Device, DevicesArchiveList } from './types';

export const getDevicesListFx = createEffect(async (params: DevicesParams) => {
	const { devices, pagination } = await rpcQuery<{
		devices: Device[];
		pagination: OptimizedPagination;
	}>(getDevicesListQuery(params), devicesAdapter);
	return { devices, pagination };
});
export const getDevicesGroupsArchiveFx = createEffect(
	async (params: DeviceArchiveParams) => {
		const devicesArchiveList = await rpcQuery<DevicesArchiveList[]>(
			getDevicesGroupsArchiveRepQuery(params),
			devicesGroupsArchiveAdapter,
		);
		return devicesArchiveList;
	},
);
getDevicesListFx.done.watch(({ result }) => {
	setDevicesList(result.devices);
	setDevicesPagination(result.pagination);
});

getDevicesListFx.fail.watch(({ error }) => {
	handleError(error);
});

getDevicesListFx.pending.watch((pending) => {
	if (pending) {
		setDevicesIsLoading(true);
	}
});

getDevicesListFx.finally.watch(() => {
	setDevicesIsLoading(false);
});

export const fetchDevicesURSV510Fx = createEffect(
	async (params: FetchDevicesURSV510Params) => {
		try {
			const devices: FetchDevicesResponse =
				await rpcQuery<FetchDevicesResponse>(
					fetchDevicesURSV510Query(params),
					devicesAdapter,
				);
			return devices;
		} catch (err) {
			if (err instanceof RpcError) {
				err.toastMessage();
			} else {
				toast.error(
					'Что-то пошло не так при получении списка приборов типа "УРСВ 510"',
				);
			}
			return {
				devices: [],
				pagination: {
					positionRow: 0,
					pageTotalCount: 1,
					pageNumber: 1,
					rowsPerPage: 100,
				},
			};
		}
	},
);
