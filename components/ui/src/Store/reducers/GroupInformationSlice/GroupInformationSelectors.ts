import { RootState } from '../../store';

export const selectForms = (state: RootState) => {
	return state.groupInformationReducer.forms;
};

export const selectSystems = (state: RootState) => {
	return state.groupInformationReducer.systems;
};

export const selectVersions = (state: RootState) => {
	return state.groupInformationReducer.versions;
};

export const selectMnemoschemes = (state: RootState) => {
	return state.groupInformationReducer.mnemoschemes;
};

export const selectIsModalOpen = (state: RootState) => {
	return state.groupInformationReducer.isModalOpen;
};

export const selectFormsIsLoading = (state: RootState) => {
	return state.groupInformationReducer.isFormsLoading;
};

export const selectSystemsIsLoading = (state: RootState) => {
	return state.groupInformationReducer.isSystemsLoading;
};

export const selectVersionsIsLoading = (state: RootState) => {
	return state.groupInformationReducer.isVersionsLoading;
};

export const selectMnemoschemesIsLoading = (state: RootState) => {
	return state.groupInformationReducer.isMnemoschemesLoading;
};

export const selectIsTreeOpen = (state: RootState) => {
	return state.groupInformationReducer.isTreeOpen;
};
