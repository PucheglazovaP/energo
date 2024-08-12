import { createStore } from 'effector';

import { TreeTypes } from '../../Shared/types';

import {
	changeType,
	setContextMenuId,
	setDisabledFlag,
	setOpenFlag,
} from './events';
import { Sidebar } from './types';

export const $sidebar = createStore<Sidebar>({
	isOpen: true,
	isDisabled: false,
	contextMenuId: 0,
	treeTypes: [
		{
			type: TreeTypes.Mnemoschemes,
			isChecked: false,
			value: 'Мнемосхемы',
		},
		{
			type: TreeTypes.Devices,
			isChecked: false,
			value: 'Приборы и каналы',
		},
		{
			type: TreeTypes.Channels,
			isChecked: false,
			value: 'Без привязки к прибору',
		},
	],
});

$sidebar.on(setOpenFlag, (state, flag) => ({
	...state,
	isOpen: flag,
}));

$sidebar.on(setDisabledFlag, (state, flag) => ({
	...state,
	isDisabled: flag,
}));

$sidebar.on(setContextMenuId, (state, id) => ({
	...state,
	contextMenuId: id,
}));

$sidebar.on(changeType, (state, type) => {
	const selectedTypeIdx = state.treeTypes.findIndex((t) => t.type === type);
	if (selectedTypeIdx === -1) {
		return state;
	}

	const newTypes = state.treeTypes.map((type) => ({
		...type,
		isChecked: false,
	}));
	newTypes[selectedTypeIdx].isChecked = true;
	return {
		...state,
		treeTypes: newTypes,
	};
});
