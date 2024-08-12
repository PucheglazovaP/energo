import { RootState } from '../../store';

export const selectIsFormulaEditorOpen = (state: RootState) => {
	return state.formulaEditorReducer.isModalOpen;
};
export const selectGroupNumberForFormulaCopy = (state: RootState) => {
	return state.formulaEditorReducer.groupNumberForFormulaCopy;
};

export const selectFormulaText = (state: RootState) => {
	return state.formulaEditorReducer.formulaText;
};
