import { createStore } from 'effector';

import {
	resetServersModel,
	rollupServersNodes,
	selectActiveServer,
	setActiveServer,
	setServersIsLoading,
	setServersList,
	toggleServersNode,
} from './events';
import { ServersModel } from './types';

export const $servers = createStore<ServersModel>({
	list: [],
	isLoading: false,
});

$servers.reset(resetServersModel);

$servers.on(setServersList, (state, list) => {
	return {
		...state,
		list,
	};
});

$servers.on(setServersIsLoading, (state, flag) => {
	return {
		...state,
		isLoading: flag,
	};
});

$servers.on(toggleServersNode, (state, node) => {
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

$servers.on(setActiveServer, (state, id) => {
	const newList = state.list.map((server) => {
		if (server.id === id) {
			return { ...server, isOpen: true };
		}
		return { ...server, isOpen: false };
	});
	return {
		...state,
		list: newList,
	};
});
// ивент, чтобы захлопнуть все сервера, кроме выбранного
$servers.on(selectActiveServer, (state, id) => {
	const newList = state.list.map((server) => {
		if (server.id === id) {
			return { ...server, isOpen: !server.isOpen };
		}
		return { ...server, isOpen: false };
	});
	return {
		...state,
		list: newList,
	};
});
$servers.on(rollupServersNodes, (state) => {
	const newList = state.list.map((node) => ({ ...node, isOpen: false }));
	return {
		...state,
		list: newList,
	};
});
