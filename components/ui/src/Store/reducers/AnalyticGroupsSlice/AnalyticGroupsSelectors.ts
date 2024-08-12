import { RootState } from '../../store';

export const selectIsAnalyticGroupsModalOpen = (state: RootState) => {
	return state.analyticGroupsReducer.isModalOpen;
};

export const selectAnalyticGroupsIsLoading = (state: RootState) => {
	return state.analyticGroupsReducer.isLoading;
};
export const selectAnalyticGroups = (state: RootState) => {
	return state.analyticGroupsReducer.analyticGroups;
};
