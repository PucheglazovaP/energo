import { RootState } from '../../store';

export const selectActiveFilters = (state: RootState) => {
	const { groupsActiveFilter, devicesActiveFilter } = state.filtersReducer;
	return { groupsActiveFilter, devicesActiveFilter };
};
