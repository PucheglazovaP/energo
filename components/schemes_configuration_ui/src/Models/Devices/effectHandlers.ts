import { FetchDevicesResponse } from '../../Shared/types';

import { DevicesModel } from './types';

export function fetchDevicesFxHandler(
	state: DevicesModel,
	data: FetchDevicesResponse,
): DevicesModel {
	const { devices, pagination } = data;

	return { ...state, list: devices, isLoading: false, pagination };
}
