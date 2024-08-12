import { createStore } from 'effector';

import { setEditVisualizationGroupData } from './events';
import { EditVisualizationGroup } from './types';

export const INITIAL_EDIT_VISUALIZATION_GROUP: EditVisualizationGroup = {
	visualizationGroupId: null,
	sortOrder: 0,
	shortName: '',
	name: '',
	comment: '',
	lastModified: null,
};

export const $editVisualizationGroupData = createStore<EditVisualizationGroup>(
	INITIAL_EDIT_VISUALIZATION_GROUP,
);

$editVisualizationGroupData.on(
	setEditVisualizationGroupData,
	(_state, payload) => payload,
);
