import { RootState } from '../../store';

export const selectUserGroups = (state: RootState) => {
	return state.userGroupsReducer.userGroups;
};
