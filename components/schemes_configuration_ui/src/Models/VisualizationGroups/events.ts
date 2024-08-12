import { createEvent } from 'effector';

import { SortOptions } from '../../Shared/types';

import { VisualizationGroupList } from './types';

export const setVisualizationGroupsListEvent = createEvent<
	VisualizationGroupList[]
>('set visualizationGroupsList');
export const setVisualizationGroupsIsLoading = createEvent<boolean>(
	'set is loading flag',
);
export const setActiveVisualizationGroupIdEvent = createEvent<number | null>(
	'set activeVisualizationGroupId',
);
export const setCurrentVisualizationGroupIdEvent = createEvent<number>(
	'set currentVisualizationGroupId',
);
export const setVisualizationGroupsSortFilterEvent = createEvent<SortOptions>(
	'set visualizationGroupsSortFilter',
);
