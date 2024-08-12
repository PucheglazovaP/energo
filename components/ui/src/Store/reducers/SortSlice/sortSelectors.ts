import { RootState } from '../../store';

export const selectSortOrders = (state: RootState) => {
	const { groupsSortOrder, devicesSortOrder, unusedChannelsSortOrder } =
		state.sortReducer;
	return { groupsSortOrder, devicesSortOrder, unusedChannelsSortOrder };
};
