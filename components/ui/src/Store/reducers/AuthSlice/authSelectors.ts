import { RootState } from '../../store';

export const selectUser = (state: RootState) => {
	return state.authReducer.user;
};
