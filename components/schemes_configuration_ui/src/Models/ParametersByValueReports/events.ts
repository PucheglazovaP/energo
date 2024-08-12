import { createEvent } from 'effector';

import { FilterOptions, SearchFilters, SortOptions } from '../../Shared/types';

import { ParametersByValueList } from './types';

export const setParametersByValueListEvent = createEvent<
	ParametersByValueList[]
>('set ParametersByValueList');
export const setTableSortFilterEvent = createEvent<SortOptions>(
	'set Table SortFilter',
);
export const setTableSearchFiltersEvent = createEvent<SearchFilters>(
	'set Table SearchFilters',
);
export const setParametersIsLoading = createEvent<boolean>(
	'set is loading flag',
);
export const setParameterTypeOptionsEvent = createEvent<FilterOptions[]>(
	'set parameterTypeOptions',
);
export const setSelectedParameterTypesEvent = createEvent<string[]>(
	'set selectedParameterTypes',
);
export const setToggledSections = createEvent<string[]>('set toggledSections');
export const setModalLinkedPointIdEvent = createEvent<number | null>(
	'set modalLinkedPointId',
);
