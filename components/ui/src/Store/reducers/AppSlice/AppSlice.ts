import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AppState {
	isSupportTooltipMode?: boolean;
}

const initialState: AppState = {
	isSupportTooltipMode: undefined,
};

export const appSlice = createSlice({
	name: 'app',
	initialState,
	reducers: {
		toggleSupportTooltipMode: (state) => {
			state.isSupportTooltipMode = !state.isSupportTooltipMode;
			localStorage.setItem(
				'isSupportTooltipMode',
				String(state.isSupportTooltipMode),
			);
		},
		setSupportTooltipMode: (state, action: PayloadAction<boolean>) => {
			state.isSupportTooltipMode = action.payload;
			localStorage.setItem(
				'isSupportTooltipMode',
				String(state.isSupportTooltipMode),
			);
		},
	},
});

export const { toggleSupportTooltipMode, setSupportTooltipMode } =
	appSlice.actions;

export default appSlice.reducer;
