import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { SortOrderMode } from './types';

export interface SortSlice {
	groupsSortOrder: SortOrderMode;
	devicesSortOrder: SortOrderMode;
	unusedChannelsSortOrder: SortOrderMode;
}

const initialState: SortSlice = {
	groupsSortOrder: SortOrderMode.NUMBER_FORWARD,
	devicesSortOrder: SortOrderMode.NUMBER_FORWARD,
	unusedChannelsSortOrder: SortOrderMode.NUMBER_FORWARD,
};

export const sortSlice = createSlice({
	name: 'app',
	initialState,
	reducers: {
		setGroupsSortOrder: (state, action: PayloadAction<SortOrderMode>) => {
			state.groupsSortOrder = action.payload;
		},
		setDevicesSortOrder: (state, action: PayloadAction<SortOrderMode>) => {
			state.devicesSortOrder = action.payload;
		},
		setUnusedChannelsSortOrder: (
			state,
			action: PayloadAction<SortOrderMode>,
		) => {
			state.unusedChannelsSortOrder = action.payload;
		},
	},
});

export const {
	setGroupsSortOrder,
	setDevicesSortOrder,
	setUnusedChannelsSortOrder,
} = sortSlice.actions;

export default sortSlice.reducer;
