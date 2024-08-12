import { RootState } from '../../store';

export const selectIsModalOpen = (state: RootState) => {
	return state.dataLocation.isModalOpen;
};
