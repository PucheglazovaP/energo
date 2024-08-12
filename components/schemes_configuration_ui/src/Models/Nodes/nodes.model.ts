import { createStore } from 'effector';

import {
	addNodesList,
	clearNodesList,
	openNodeById,
	setNodesActiveNode,
	setNodesList,
	toggleNodesActiveNode,
} from './events';
import { NodesModel } from './types';

export const $nodes = createStore<NodesModel>({
	list: [],
	isLoading: false,
	search: '',
})
	.on(setNodesList, (state, list) => {
		return {
			...state,
			list,
		};
	})
	.on(addNodesList, (state, list) => {
		return {
			...state,
			list: [...state.list, ...list],
		};
	})
	.on(clearNodesList, (state) => {
		return {
			...state,
			list: [],
		};
	})
	.on(setNodesActiveNode, (state, activeNode) => {
		return {
			...state,
			activeNode,
		};
	})
	.on(toggleNodesActiveNode, (state, node) => {
		return {
			...state,
			list: state.list.map((listItem) => {
				if (listItem.id === node.id) {
					return {
						...listItem,
						isOpen: !listItem.isOpen,
					};
				}

				return listItem;
			}),
		};
	})
	.on(openNodeById, (state, nodeId: number) => {
		return {
			...state,
			list: state.list.map((listItem) => {
				if (listItem.id === nodeId) {
					return {
						...listItem,
						isOpen: true,
					};
				}

				return { ...listItem };
			}),
		};
	});
