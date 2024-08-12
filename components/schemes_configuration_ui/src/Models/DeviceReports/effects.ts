import { toast } from 'react-toastify';
import { createEffect } from 'effector';

import {
	getDeviceParametersAdapter,
	updateDeviceParameterAdapter,
} from '../../Adapters/ReportsByDevices/deviceParametersAdapter';
import { getDeviceReportsAdapter } from '../../Adapters/ReportsByDevices/deviceReportsAdapter';
import { getDevicesListAdapter } from '../../Adapters/ReportsByDevices/devicesListAdapter';
import {
	getDeviceParametersQuery,
	updateDeviceParametersQuery,
} from '../../Const/Queries/deviceParameters';
import {
	getDeviceReportsQuery,
	getDevicesListQuery,
} from '../../Const/Queries/deviceReports';
import { DeviceParams } from '../../Shared/types';
import { RpcError, rpcQuery } from '../../Utils/requests';

import {
	DeviceParameter,
	DeviceReport,
	DeviceReportsParams,
	DevicesList,
	DevicesListParams,
} from './types';

// Запрос параметров прибора
export const getDeviceParametersFx = createEffect(
	async (params: DeviceParams) => {
		try {
			const deviceParameters: DeviceParameter[] = await rpcQuery<
				DeviceParameter[]
			>(getDeviceParametersQuery(params), getDeviceParametersAdapter);

			return deviceParameters;
		} catch (err) {
			if (err instanceof RpcError) {
				err.toastMessage();
			} else {
				toast.error(
					'Что-то пошло не так c обновлением значения параметра прибора',
				);
			}

			return [];
		}
	},
);

// Обновление значения параметра прибора
export const updateDeviceParameterFx = createEffect(
	async (params: DeviceParams) => {
		try {
			const responseError: string | null = await rpcQuery<string | null>(
				updateDeviceParametersQuery(params),
				updateDeviceParameterAdapter,
			);

			return !responseError;
		} catch (err) {
			if (err instanceof RpcError) {
				err.toastMessage();
			} else {
				toast.error(
					'Что-то пошло не так c обновлением значения параметра прибора',
				);
			}

			return false;
		}
	},
);

// Получение списка отчетов по показаниям приборов
export const getDeviceReportsFx = createEffect(
	async (params: DeviceReportsParams) => {
		try {
			const deviceReports: DeviceReport[] = await rpcQuery<DeviceReport[]>(
				getDeviceReportsQuery(params),
				getDeviceReportsAdapter,
			);

			return deviceReports;
		} catch (err) {
			if (err instanceof RpcError) {
				err.toastMessage();
			} else {
				toast.error(
					'Что-то пошло не так при получении списка отчетов по показаниям приборов',
				);
			}

			return [];
		}
	},
);

// Получение списка приборов для отчетов по показаниям приборов
export const getDevicesListFx = createEffect(
	async (params: DevicesListParams) => {
		try {
			const devicesList: DevicesList[] = await rpcQuery<DevicesList[]>(
				getDevicesListQuery(params),
				getDevicesListAdapter,
			);

			return devicesList;
		} catch (err) {
			if (err instanceof RpcError) {
				err.toastMessage();
			} else {
				toast.error(
					'Что-то пошло не так при получении списка приборов для отчетов по показаниям приборов',
				);
			}
			return [];
		}
	},
);
