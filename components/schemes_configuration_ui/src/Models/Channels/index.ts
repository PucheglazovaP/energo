import { createStore } from 'effector';

import { setDevicesChannelActiveNode } from '../Devices/events';

import {
	addChannelsList,
	clearChannelsList,
	clearChannelsPagination,
	setChannelsActiveNode,
	setChannelsIsLoading,
	setChannelsList,
	setChannelsPagination,
	setChannelsSearch,
	toggleChannelsNode,
} from './events';
import { ChannelsModel } from './types';

const initState: ChannelsModel = {
	list: [],
	isLoading: false,
	pagination: {
		pageTotalCount: 1,
		pageNumber: 1,
		rowsPerPage: 100,
	},
	activeNode: undefined,
	search: '',
};

export const $channels = createStore<ChannelsModel>(initState);

$channels.on(setChannelsList, (state, list) => ({
	...state,
	list,
}));

$channels.on(addChannelsList, (state, list) => {
	return {
		...state,
		list: [...state.list, ...list],
	};
});

$channels.on(setChannelsIsLoading, (state, flag) => {
	return {
		...state,
		isLoading: flag,
	};
});

$channels.on(clearChannelsList, (state) => ({
	...state,
	list: [],
}));

$channels.on(clearChannelsPagination, (state) => ({
	...state,
	pagination: initState.pagination,
}));

$channels.on(setChannelsPagination, (state, pagination) => ({
	...state,
	pagination: {
		...state.pagination,
		...pagination,
	},
}));

$channels.on(setChannelsActiveNode, (state, node) => ({
	...state,
	activeNode: node,
}));

$channels.on(setDevicesChannelActiveNode, (state, node) => ({
	...state,
	activeNode: node,
}));

$channels.on(setChannelsSearch, (state, search) => ({
	...state,
	search,
}));

$channels.on(toggleChannelsNode, (state, node) => {
	const chosenNodeIdx = state.list.findIndex((n) => n.id === node.id);
	if (chosenNodeIdx !== -1) {
		const newList = [...state.list];
		newList[chosenNodeIdx] = {
			...newList[chosenNodeIdx],
			isOpen: !newList[chosenNodeIdx].isOpen,
		};
		return {
			...state,
			list: newList,
		};
	}
});
