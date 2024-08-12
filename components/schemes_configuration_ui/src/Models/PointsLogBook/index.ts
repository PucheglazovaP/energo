import { createStore, sample } from 'effector';

import {
	fetchPointLogBookBodyListFx,
	fetchPointLogBookHeaderListFx,
} from './effects';
import {
	savePointLogBookValueEvent,
	setPointLogBookBodyEvent,
	setPointLogBookHeaderEvent,
	setPointLogBookIsLoadingEvent,
} from './events';
import { PointLogBook } from './types';

const INITIAL_POINT_LOG_BOOK = {
	pointLogBookHeader: [],
	pointLogBookBody: [],
	isLoading: true,
};

export const $pointLogBook = createStore<PointLogBook>(INITIAL_POINT_LOG_BOOK);

$pointLogBook
	.on(setPointLogBookHeaderEvent, (state, pointLogBookHeader) => {
		return {
			...state,
			pointLogBookHeader,
		};
	})
	.on(setPointLogBookBodyEvent, (state, pointLogBookBody) => {
		return {
			...state,
			pointLogBookBody,
		};
	})
	.on(setPointLogBookIsLoadingEvent, (state, isLoading) => {
		return {
			...state,
			isLoading,
		};
	})
	.on(fetchPointLogBookHeaderListFx.doneData, (state) => {
		return { ...state, isLoading: false };
	})
	.on(fetchPointLogBookBodyListFx.doneData, (state) => {
		return { ...state, isLoading: false };
	})
	/* при изменении значения ячейки в таблице */
	.on(savePointLogBookValueEvent, (state, payload) => {
		const updatedBodyData = state.pointLogBookBody.map((row) => {
			if (row.date === payload.id) {
				const editColumValue = row[payload.columnName as keyof typeof row];
				return {
					...row,
					[payload.columnName as keyof typeof row]:
						typeof editColumValue === 'object'
							? {
									...editColumValue,
									val: payload?.value ?? '',
							  }
							: payload.value,
				};
			}

			return row;
		});

		return { ...state, pointLogBookBody: updatedBodyData };
	});

/* ------------------------------------------ samples ------------------------------------------ */

sample({
	clock: fetchPointLogBookHeaderListFx.doneData,
	target: setPointLogBookHeaderEvent,
});

sample({
	clock: fetchPointLogBookBodyListFx.doneData,
	target: setPointLogBookBodyEvent,
});
