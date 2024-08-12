import { createEffect } from 'effector';

import {
	getDeviceByEquipmentNumberAdapter,
	measuringInstrumentsAdapter,
	measuringInstrumentTypesAdapter,
	measuringInstrumentUserStatusesAdapter,
} from '../../Adapters/measuringInstruments';
import {
	getDeviceByEquipmentNumberQuery,
	getMeasuringTypesListQuery,
	getUMeasuringInstrumentsListQuery,
	getUserStatusesListQuery,
} from '../../Const/Queries/measuringInstruments';
import {
	getDeviceByEquipmentNumberParams,
	getMeasuringInstrumentsFiltersParams,
	GetMeasuringInstrumentsListParams,
} from '../../Const/Queries/measuringInstruments/types';
import { NSIMeasuringInstrumentsResponse } from '../../Shared/types';
import { handleError } from '../../Utils/handleToast';
import { rpcQuery } from '../../Utils/requests';

import {
	addMeasuringInstrumentsList,
	setMeasuringInstrumentsList,
	setMeasuringInstrumentTypes,
	setMeasuringInstrumentUserStatuses,
	setPaginationResponse,
} from './events';
import {
	GetDeviceByEquipmentNumberData,
	NSIMeasuringInstrumentsType,
	NSIMeasuringInstrumentsUserStatus,
} from './types';

export const getMeasuringInstrumentsListFx = createEffect<
	GetMeasuringInstrumentsListParams,
	NSIMeasuringInstrumentsResponse
>('Get measuring instruments list effect', {
	handler: async (params) => {
		const response = await rpcQuery<NSIMeasuringInstrumentsResponse>(
			getUMeasuringInstrumentsListQuery(params),
			measuringInstrumentsAdapter,
		);

		return response;
	},
});

getMeasuringInstrumentsListFx.done.watch(({ params, result }) => {
	setPaginationResponse(result.pagination);

	if (params.action === 'add') {
		addMeasuringInstrumentsList({
			instrumentsList: result.instruments,
			pageNumber: params.pageNumber,
			shouldAddToTop: params.shouldAddToTop,
		});
	} else {
		setMeasuringInstrumentsList({
			instrumentsList: result.instruments,
			pageNumber: params.pageNumber,
			pagination: result.pagination,
		});
	}
});

getMeasuringInstrumentsListFx.fail.watch(({ error }) => {
	handleError(error);
});

export const getMeasuringInstrumentTypesFx = createEffect<
	getMeasuringInstrumentsFiltersParams,
	NSIMeasuringInstrumentsType[]
>('Get measuring instrument types effect', {
	handler: async (params) => {
		const measuringTypesList = await rpcQuery<NSIMeasuringInstrumentsType[]>(
			getMeasuringTypesListQuery(params),
			measuringInstrumentTypesAdapter,
		);

		return measuringTypesList;
	},
});

getMeasuringInstrumentTypesFx.done.watch(({ result }) => {
	setMeasuringInstrumentTypes(result);
});

getMeasuringInstrumentTypesFx.fail.watch(({ error }) => {
	handleError(error);
});

export const getMeasuringInstrumentUserStatusesFx = createEffect<
	getMeasuringInstrumentsFiltersParams,
	NSIMeasuringInstrumentsUserStatus[]
>('Get measuring instrument user statuses effect', {
	handler: async (params) => {
		const userStatusesList = await rpcQuery<
			NSIMeasuringInstrumentsUserStatus[]
		>(getUserStatusesListQuery(params), measuringInstrumentUserStatusesAdapter);

		return userStatusesList;
	},
});

getMeasuringInstrumentUserStatusesFx.done.watch(({ result }) => {
	setMeasuringInstrumentUserStatuses(result);
});

getMeasuringInstrumentUserStatusesFx.fail.watch(({ error }) => {
	handleError(error);
});

export const getDeviceByEquipmentNumberFx = createEffect<
	getDeviceByEquipmentNumberParams,
	GetDeviceByEquipmentNumberData
>('Get device id by equipment number', {
	handler: async (params) => {
		const response = await rpcQuery<GetDeviceByEquipmentNumberData>(
			getDeviceByEquipmentNumberQuery(params),
			getDeviceByEquipmentNumberAdapter,
		);

		return response;
	},
});
