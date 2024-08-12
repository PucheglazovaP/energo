import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
	AnalyticGroups,
	DeleteAnalyticGroupRange,
	NewAnalyticGroupRange,
	UpdateAnalyticGroupRange,
} from './types';

interface AnalyticGroupsState {
	isModalOpen: boolean;
	isLoading: boolean;
	analyticGroups: AnalyticGroups[];
}

const initialState: AnalyticGroupsState = {
	isModalOpen: false,
	isLoading: false,
	analyticGroups: [],
};

export const analyticGroupsSlice = createSlice({
	name: 'analytic groups',
	initialState,
	reducers: {
		openAnalyticGroupsModal: (state) => {
			state.isModalOpen = true;
		},
		closeAnalyticGroupsModal: (state) => {
			state.isModalOpen = false;
		},
		setAnalyticGroupsIsLoading: (state, action: PayloadAction<boolean>) => {
			state.isLoading = action.payload;
		},
		setAnalyticGroups: (state, action: PayloadAction<AnalyticGroups[]>) => {
			state.analyticGroups = action.payload;
		},
		toggleCollapseAnalyticGroup: (state, action: PayloadAction<string>) => {
			const id = action.payload;
			const chosenHistory = state.analyticGroups.find(
				(elem) => elem.analyticId === id,
			);
			if (chosenHistory) {
				chosenHistory.isCollapsed = !chosenHistory.isCollapsed;
			}
		},
		createAnalyticGroupsRange: (
			state,
			action: PayloadAction<NewAnalyticGroupRange>,
		) => {
			const { rangeId, rangeStart, analyticId, rangeEnd, lastModified } =
				action.payload;

			state.analyticGroups = state.analyticGroups.map((group) => {
				if (group.analyticId === analyticId) {
					return {
						...group,
						ranges: group.ranges.concat([
							{ rangeId, rangeStart, rangeEnd, lastModified },
						]),
					};
				} else {
					return group;
				}
			});
		},
		deleteAnalyticGroupsRange: (
			state,
			action: PayloadAction<DeleteAnalyticGroupRange>,
		) => {
			const { rangeId, analyticId } = action.payload;

			state.analyticGroups = state.analyticGroups.map((group) => {
				if (group.analyticId === analyticId) {
					return {
						...group,
						ranges: group.ranges.filter((range) => range.rangeId !== rangeId),
					};
				} else {
					return group;
				}
			});
		},
		updateAnalyticGroupsRange: (
			state,
			action: PayloadAction<UpdateAnalyticGroupRange>,
		) => {
			const { rangeId, analyticId, lastModified, rangeStart, rangeEnd } =
				action.payload;

			state.analyticGroups = state.analyticGroups.map((group) => {
				if (group.analyticId === analyticId) {
					return {
						...group,
						ranges: group.ranges.map((range) => {
							if (range.rangeId === rangeId) {
								return {
									...range,
									lastModified,
									rangeStart,
									rangeEnd,
								};
							}
							return range;
						}),
					};
				}
				return group;
			});
		},
	},
});

export default analyticGroupsSlice.reducer;
