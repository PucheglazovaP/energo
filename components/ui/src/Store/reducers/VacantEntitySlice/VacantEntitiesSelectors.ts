import { RootState } from '../../store';

export const selectVacantEntities = (state: RootState) => {
	return state.vacantEntitiesReducer.vacantEntities;
};

export const selectIsVacantEntitiesLoading = (state: RootState) => {
	return state.vacantEntitiesReducer.isLoading;
};

export const selectIsVacantEntitiesOpen = (state: RootState) => {
	return state.vacantEntitiesReducer.isModalOpen;
};

export const selectVacantEntitiesTotalCount = (state: RootState) => {
	return state.vacantEntitiesReducer.totalCount;
};
export const selectVacantEntitiesSelectorData = (state: RootState) => {
	return state.vacantEntitiesReducer.vacantEntitiesSelectorData;
};
export const selectActiveVacantEntity = (state: RootState) => {
	return state.vacantEntitiesReducer.activeVacantEntityType;
};
