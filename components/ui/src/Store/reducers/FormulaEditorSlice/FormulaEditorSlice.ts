import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ParametersProps {
	isModalOpen?: boolean;
	groupNumberForFormulaCopy: null | number;
	formulaText: string;
}

export const initialState: ParametersProps = {
	isModalOpen: false,
	groupNumberForFormulaCopy: null,
	formulaText: '',
};

export const formulaEditorSlice = createSlice({
	name: 'formulaEditor',
	initialState,
	reducers: {
		openFormulaEditorModal: (state) => {
			state.isModalOpen = true;
		},
		closeFormulaEditorModal: (state) => {
			state.isModalOpen = false;
		},
		setGroupNumberForFormulaCopy: (
			state,
			action: PayloadAction<number | null>,
		) => {
			state.groupNumberForFormulaCopy = action.payload;
		},
		setFormulaText: (state, action: PayloadAction<string>) => {
			state.formulaText = action.payload;
		},
	},
});

export const {
	openFormulaEditorModal,
	closeFormulaEditorModal,
	setGroupNumberForFormulaCopy,
	setFormulaText,
} = formulaEditorSlice.actions;

export default formulaEditorSlice.reducer;
