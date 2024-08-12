import { createEvent } from 'effector';

import { EditVisualizationGroup } from './types';

export const setEditVisualizationGroupData =
	createEvent<EditVisualizationGroup>();
