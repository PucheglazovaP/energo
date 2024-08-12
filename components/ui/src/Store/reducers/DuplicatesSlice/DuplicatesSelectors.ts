import { RootState } from '../../store';

export const selectIsModalDuplicatesOpen = (state: RootState) => {
	return state.duplicatesReducer.isModalOpen;
};
