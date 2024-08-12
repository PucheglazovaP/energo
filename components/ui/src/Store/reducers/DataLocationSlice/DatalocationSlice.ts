import { createSlice } from '@reduxjs/toolkit';

export interface ParametersProps {
	channelNumber: number | null;
	userID: number | null;
	moduleName: number | null;
	error: number | null;
	textError: string | null;
	isModalOpen?: boolean;
}

export const initialState: ParametersProps = {
	isModalOpen: false,
	channelNumber: null,
	userID: null,
	moduleName: 0,
	error: 0,
	textError: '',
};

export const parametersSlice = createSlice({
	name: 'parameters',
	initialState,
	reducers: {
		openParametersModal: (state) => {
			state.isModalOpen = true;
		},
		closeParametersModal: (state) => {
			state.isModalOpen = false;
		},
		setParametersNumber: (state, action: any) => {
			state.channelNumber = action.payload;
		},
		setParametersUserID: (state, action: any) => {
			state.userID = action.payload;
		},
		setParametersModuleName: (state, action: any) => {
			state.moduleName = action.payload;
		},
		setParametersError: (state, action: any) => {
			state.error = action.payload;
		},
		setParametersTextError: (state, action: any) => {
			state.textError = action.payload;
		},
	},
});

export const {
	setParametersNumber,
	setParametersUserID,
	setParametersModuleName,
	setParametersError,
	setParametersTextError,
	openParametersModal,
	closeParametersModal,
} = parametersSlice.actions;

export default parametersSlice.reducer;
