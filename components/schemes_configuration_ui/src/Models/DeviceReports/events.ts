import { createEvent } from 'effector';

import { DevicesReportTitle } from '../../Containers/DeviceReports/types';
import { FilterOptions, SearchFilters, SortOptions } from '../../Shared/types';

import { DeviceParameter, DeviceReport, DevicesList } from './types';

export const setEditModeEvent = createEvent<boolean>('set EditMode');
export const setActiveDeviceIdEvent = createEvent<number>('set ActiveDeviceId');
export const setDeviceTypeOptionsEvent = createEvent<FilterOptions[]>(
	'set deviceTypeOptions',
);
export const setSelectedDeviceTypesEvent = createEvent<string[]>(
	'set selectedDeviceTypes',
);
export const setChangeTypeEvent =
	createEvent<DevicesReportTitle>('set ChangeType');
export const setDeviceParametersEvent = createEvent<DeviceParameter[]>(
	'set DeviceParameters',
);
export const updateDeviceParameterEvent = createEvent<DeviceParameter>(
	'update DeviceParameter',
);
export const setDeviceReportsEvent =
	createEvent<DeviceReport[]>('set DeviceReports');
export const setDevicesListEvent =
	createEvent<DevicesList[]>('set DevicesList');
export const setTableSortFilterEvent = createEvent<SortOptions>(
	'set Table SortFilter',
);
export const setTableSearchFiltersEvent = createEvent<SearchFilters>(
	'set Table SearchFilters',
);
export const setDevicesIsLoading = createEvent<boolean>('set is loading flag');
