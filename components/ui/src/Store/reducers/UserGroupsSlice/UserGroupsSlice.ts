import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { UserGroup, UserGroupsState } from './types';

const initialState: UserGroupsState = {
	userGroups: [],
};

export const userGroupsSlice = createSlice({
	name: 'userGroups',
	initialState,
	reducers: {
		setUserGroups: (state, action: PayloadAction<UserGroup[]>) => {
			state.userGroups = action.payload;
		},
	},
});
export const { setUserGroups } = userGroupsSlice.actions;
export default userGroupsSlice.reducer;
