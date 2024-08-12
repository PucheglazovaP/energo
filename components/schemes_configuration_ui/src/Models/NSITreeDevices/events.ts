import { createEvent } from 'effector';

export const setNSICurrentObjectType = createEvent<string | null>(
	'Set object type of selected NSI tree item',
);
export const setNSIExtendedFiltersParameterCheckedIds = createEvent<{
	parameterId: number;
	checkedIds: number[];
}>('Set NSI extended filter values checked ids for selected parameter');
export const setNSIExtendedFiltersCheckedIds = createEvent<
	Map<number, number[]>
>('Set NSI extended filter values current checked ids');
export const setNSIExtendedFiltersCheckedIdsConfirmed = createEvent<
	Map<number, number[]>
>('Set NSI extended filter values confirmed checked ids');
export const clearNSIParameterFilter = createEvent<number>(
	'Clear checked ids for selected NSI parameter',
);
export const clearNSIParameterFilters = createEvent<void>(
	'Clear checked ids for all NSI parameter',
);
export const setAreDevicesNotFound = createEvent<boolean>(
	'Set flag if filtered devices list is empty',
);
export const setNSIParametersExtendedFilterStr = createEvent<string>(
	'Set filter string for NSI devices tree',
);
