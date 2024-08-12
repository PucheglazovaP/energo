import { RootState } from '../../store';

export const selectIsModalOpen = (state: RootState) => {
	return state.historyReducer.isModalOpen;
};

export const selectHistory = (state: RootState) => {
	return state.historyReducer.history;
};

export const selectHistoryIsLoading = (state: RootState) => {
	return state.historyReducer.isLoading;
};

export const selectHistoryFilters = (state: RootState) => {
	return state.historyReducer.filters;
};

export const selectHistoryType = (state: RootState) => {
	return state.historyReducer.type;
};

export const selectHistoryTotalCount = (state: RootState) => {
	return state.historyReducer.totalCount;
};
