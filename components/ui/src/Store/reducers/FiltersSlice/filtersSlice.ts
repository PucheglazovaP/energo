import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface FiltersState {
	groupsActiveFilter: number;
	devicesActiveFilter: number;
}

const initialState: FiltersState = {
	groupsActiveFilter: 1,
	devicesActiveFilter: 1,
};

export const filtersSlice = createSlice({
	name: 'filters',
	initialState,
	reducers: {
		setGroupsActiveFilter: (state, action: PayloadAction<number>) => {
			state.groupsActiveFilter = action.payload;
		},
		setDevicesActiveFilter: (state, action: PayloadAction<number>) => {
			state.devicesActiveFilter = action.payload;
		},
	},
});

// Action creators are generated for each case reducer function
export const { setGroupsActiveFilter, setDevicesActiveFilter } =
	filtersSlice.actions;

export default filtersSlice.reducer;
