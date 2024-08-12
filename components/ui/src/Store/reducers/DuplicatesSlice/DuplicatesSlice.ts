import { createSlice } from '@reduxjs/toolkit';

export interface ParametersProps {
	DuplicatesNumber: number | null;
	isModalOpen?: boolean;
}

export const initialState: ParametersProps = {
	DuplicatesNumber: null,
	isModalOpen: false,
};

export const parametersSlice = createSlice({
	name: 'parameters',
	initialState,
	reducers: {
		openDuplicatesModal: (state) => {
			state.isModalOpen = true;
		},
		closeDuplicatesModal: (state) => {
			state.isModalOpen = false;
		},
		setParametersNumber: (state, action: any) => {
			state.DuplicatesNumber = action.payload;
		},
	},
});

export const {
	setParametersNumber,
	openDuplicatesModal,
	closeDuplicatesModal,
} = parametersSlice.actions;

export default parametersSlice.reducer;
