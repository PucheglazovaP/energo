import { createStore } from 'effector';

import {
	addNodeItemsList,
	clearNodeItemsList,
	openNodeItemNode,
	setNodeItemsActiveNode,
	setNodeItemsList,
	toggleNodeItemsActiveNode,
} from './events';
import { NodeItemsModel } from './types';

export const $nodeItems = createStore<NodeItemsModel>({
	list: [],
	isLoading: false,
	search: '',
})
	.on(setNodeItemsList, (state, list) => {
		return {
			...state,
			list,
		};
	})
	.on(addNodeItemsList, (state, list) => {
		return {
			...state,
			list: [...state.list, ...list],
		};
	})
	.on(clearNodeItemsList, (state) => {
		return {
			...state,
			list: [],
		};
	})
	.on(setNodeItemsActiveNode, (state, activeNode) => {
		return {
			...state,
			activeNode,
		};
	})
	.on(toggleNodeItemsActiveNode, (state, node) => {
		return {
			...state,
			list: state.list.map((listItem) => {
				if (listItem.id === node.id && listItem.parentId === node.parentId) {
					return {
						...listItem,
						isOpen: !listItem.isOpen,
					};
				}

				return listItem;
			}),
		};
	})
	.on(openNodeItemNode, (state, node) => {
		return {
			...state,
			list: state.list.map((listItem) => {
				if (listItem.id === node.id && listItem.parentId === node.parentId) {
					return {
						...listItem,
						isOpen: true,
					};
				}

				return listItem;
			}),
		};
	});
