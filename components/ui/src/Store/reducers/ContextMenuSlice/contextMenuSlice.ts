import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

import {
	ContextMenuItem,
	ContextMenuType,
	ContextMenuTypes,
	GROUP_DEFAULT_CONTEXT_MENU,
	PositionTypes,
} from '../../../Types/ContextMenuTypes';

const initialState: ContextMenuTypes = {
	position: [-1000, -1000],
	// TODO: delete items from here and use items from useContextMenu instead
	items: [],
	id: 0,
	parentId: 0,
	type: GROUP_DEFAULT_CONTEXT_MENU,
	itemTitle: '',
};

export const contextMenuSlice = createSlice({
	name: 'contextMenu',
	initialState,
	reducers: {
		setContextMenuItems: (state, action: PayloadAction<ContextMenuItem[]>) => {
			state.items = action.payload;
		},
		setContextMenuPosition: (state, action: PayloadAction<PositionTypes>) => {
			state.position = action.payload;
		},
		setContextMenuId: (state, action: PayloadAction<number>) => {
			state.id = action.payload;
		},
		setContextMenuParentId: (state, action: PayloadAction<number>) => {
			state.parentId = action.payload;
		},
		setContextMenuType: (state, action: PayloadAction<ContextMenuType>) => {
			state.type = action.payload;
		},
		setContextMenuItemTitle: (state, action: PayloadAction<string>) => {
			state.itemTitle = action.payload;
		},
	},
});

// Action creators are generated for each case reducer function
export const {
	setContextMenuItems,
	setContextMenuPosition,
	setContextMenuId,
	setContextMenuParentId,
	setContextMenuType,
	setContextMenuItemTitle,
} = contextMenuSlice.actions;

export default contextMenuSlice.reducer;
