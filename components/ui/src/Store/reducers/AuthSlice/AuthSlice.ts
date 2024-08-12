import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { User } from '../../../Shared/types';

export interface AuthState {
	user: User | null;
	isAuthenticated: boolean;
	userGroups: [];
}

const initialState: AuthState = {
	user: null,
	isAuthenticated: false,
	userGroups: [],
};

export const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		setUserInfo: (state, action: PayloadAction<User | null>) => {
			state.user = action.payload;
		},
		initAuthentication: (state, action: PayloadAction<boolean>) => {
			state.isAuthenticated = action.payload;
		},
	},
});

export const { setUserInfo, initAuthentication } = authSlice.actions;

export default authSlice.reducer;
