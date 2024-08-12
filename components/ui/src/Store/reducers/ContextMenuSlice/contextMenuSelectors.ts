import { RootState } from '../../store';

export const selectContextMenuId = (state: RootState) => {
	return state.contextMenuReducer.id;
};

export const selectContextMenuType = (state: RootState) => {
	return state.contextMenuReducer.type;
};
export const selectContextMenuItemTitle = (state: RootState) => {
	return state.contextMenuReducer.itemTitle;
};
