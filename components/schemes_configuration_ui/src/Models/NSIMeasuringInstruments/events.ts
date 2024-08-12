import { createEvent } from 'effector';

import {
	NSIMeasuringInstrument,
	NSIMeasuringInstrumentsFiltersModel,
	NSIMeasuringInstrumentsPagination,
	NSIMeasuringInstrumentsPaginationResponse,
	NSIMeasuringInstrumentsType,
	NSIMeasuringInstrumentsUserStatus,
} from './types';

export const setMeasuringInstrumentsList = createEvent<{
	instrumentsList: NSIMeasuringInstrument[];
	pageNumber: number;
	pagination: NSIMeasuringInstrumentsPaginationResponse;
}>('Set NSI measuring instruments list');

export const addMeasuringInstrumentsList = createEvent<{
	instrumentsList: NSIMeasuringInstrument[];
	pageNumber: number;
	shouldAddToTop?: boolean;
}>('Add NSI measuring instruments list');

export const setMeasuringInstrumentsPageNumber = createEvent<number>(
	'Set NSI measuring instruments page number',
);

export const changeAllInstrumentsCheckedState = createEvent(
	'Change NSI all measuring instruments checked state',
);

export const changeInstrumentCheckedState = createEvent<
	Pick<NSIMeasuringInstrument, 'equipmentNumber' | 'factoryNumber'>
>('Change NSI measuring instrument checked state');

export const changeEquipmentShortName = createEvent<string>(
	'Change NSI measuring instrument equipment short name',
);

export const changeManufacturerTypeName = createEvent<string>(
	'Change NSI measuring instrument manufacturer type name',
);

export const changeLocation = createEvent<string>(
	'Change NSI measuring instrument location',
);
export const changeFactoryNumber = createEvent<string>(
	'Change NSI measuring instrument factory number',
);

export const setMeasuringInstrumentTypes = createEvent<
	NSIMeasuringInstrumentsType[]
>('Set NSI measuring instrument types');

export const setMeasuringInstrumentUserStatuses = createEvent<
	NSIMeasuringInstrumentsUserStatus[]
>('Set NSI measuring instrument user statuses');
export const setInstrumentTypesCheckedIds = createEvent<string[]>(
	'Set checked ids of extended filter instrument types tree items',
);
export const setUserStatusesCheckedIds = createEvent<string[]>(
	'Set checked ids of extended filter user statuses tree items',
);
export const setNsiMeasuringInstrumentsFilters =
	createEvent<NSIMeasuringInstrumentsFiltersModel>(
		'Set stringified user statuses and instrument types for extended filter',
	);

export const setPaginationResponse =
	createEvent<NSIMeasuringInstrumentsPaginationResponse>(
		'Set NSI measuring instruments journal pagination response',
	);
export const setPagination = createEvent<NSIMeasuringInstrumentsPagination>(
	'Set NSI measuring instruments journal pagination',
);
export const setSelectedRow = createEvent<string>(
	'Set selected measuring instruments journal equipment number to position',
);
export const clearSearchValues = createEvent<void>('Reset search values');
export const clearExtendedFilter = createEvent<void>(
	'Reset extended filter values',
);

export const setCurrentDeviceId = createEvent<number | null>(
	'Set current device id for equipment positioning in Tree NSI',
);
export const setCurrentNodeId = createEvent<number | null>(
	'Set current node id for equipment positioning in Tree NSI',
);
