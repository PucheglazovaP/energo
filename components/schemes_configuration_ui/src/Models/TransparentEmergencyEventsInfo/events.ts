import { createEvent } from 'effector';

import {
	FilterOptions,
	SortOptions,
	TransparentEmergencyEventsStatusList,
} from '../../Shared/types';

export const setMetricId = createEvent<number>();
export const setEventsInfo =
	createEvent<TransparentEmergencyEventsStatusList[]>();
export const setEventStatusTypeOptions = createEvent<FilterOptions[]>();
export const setKvitPersonsOptions = createEvent<FilterOptions[]>();
export const setSelectedEventStatusTypeOptions = createEvent<number[]>();
export const setSelectedKvitPersonsOptions = createEvent<string[]>();
export const setTableSortFilter = createEvent<SortOptions>();
