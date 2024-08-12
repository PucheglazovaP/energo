import { createEvent } from 'effector';

import { SortOptions } from '../../Shared/types';

import {
	ActivePoint,
	EditPointParams,
	MovePointsSortOrder,
	Point,
	PointChannel,
	PointCoefficient,
} from './types';

export const setPointsList = createEvent<Point[]>();

export const onCollapse = createEvent<{ id: number; userId: string }>();

export const setPointChannels = createEvent<PointChannel[]>();

export const movePoints = createEvent<MovePointsSortOrder>();

export const setPointsTableSortFilterEvent = createEvent<SortOptions>();

export const changeIsActivePointEvent = createEvent<ActivePoint>();

export const updatePointCoefficient = createEvent<PointCoefficient>();

export const setContextMenuIdEvent = createEvent<number>();

export const setEditPointData = createEvent<EditPointParams>();

export const setFocusPointId = createEvent<number | null>();
