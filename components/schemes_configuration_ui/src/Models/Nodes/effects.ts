import { toast } from 'react-toastify';
import { createEffect, sample } from 'effector';

import { nodesAdapter } from '../../Adapters/nodes';
import {
	createNodeQuery,
	deleteNodeQuery,
	editNodeQuery,
	getNodesListQuery,
} from '../../Const/Queries/nodes';
import { NodesParams } from '../../Const/Queries/nodes/types';
import {
	CreateNodeParams,
	DeleteNodeParams,
	EditNodeParams,
} from '../../Shared/types';
import { ModuleName } from '../../Shared/Types/moduleName';
import { RpcError, rpcQuery } from '../../Utils/requests';
import { $user } from '../Auth';
import { $nsiSelectedNode } from '../NSISelectedUnit';

import { addNodesList, setNodesList } from './events';
import { NSINode } from './types';

export const getNodesListFx = createEffect<NodesParams, NSINode[]>(
	'Get nodes list effect',
	{
		handler: async (params) => {
			const nodes = await rpcQuery<NSINode[]>(
				getNodesListQuery(params),
				nodesAdapter,
			);

			return nodes;
		},
	},
);

export const createNodeFx = createEffect(async (params: CreateNodeParams) => {
	try {
		await rpcQuery<void>(createNodeQuery(params));
	} catch (err) {
		if (err instanceof RpcError) {
			err.toastMessage();
		} else {
			toast.error('Что-то пошло не так при создании узла учета');
		}
	}
});

export const editNodeFx = createEffect(async (params: EditNodeParams) => {
	try {
		await rpcQuery<void>(editNodeQuery(params));
	} catch (err) {
		if (err instanceof RpcError) {
			err.toastMessage();
		} else {
			toast.error('Что-то пошло не так при изменении узла учета');
		}
	}
});

export const deleteNodeFx = createEffect(async (params: DeleteNodeParams) => {
	try {
		await rpcQuery<void>(deleteNodeQuery(params));
	} catch (err) {
		if (err instanceof RpcError) {
			err.toastMessage();
		} else {
			toast.error('Что-то пошло не так при удалении узла учета');
		}
	}
});

getNodesListFx.done.watch(({ result, params }) => {
	if (params.action === 'add') {
		addNodesList(result);
	} else {
		setNodesList(result);
	}
});

sample({
	clock: createNodeFx.done,
	source: { selectedNode: $nsiSelectedNode, user: $user },
	fn: (src) => {
		const { selectedNode, user } = src;
		if (user && selectedNode) {
			getNodesListFx({
				userId: user.preferredUsername,
				deviceId: selectedNode.id,
				action: 'set',
				moduleName: ModuleName.Nodes_effects_getNodesListFx,
			});
		}
	},
});

sample({
	clock: [editNodeFx.done, deleteNodeFx.done],
	source: { selectedNode: $nsiSelectedNode, user: $user },
	fn: (src) => {
		const { selectedNode, user } = src;
		if (user && selectedNode && selectedNode.parentId) {
			getNodesListFx({
				userId: user.preferredUsername,
				deviceId: selectedNode.parentId,
				action: 'set',
				moduleName: ModuleName.Nodes_effects_getNodesListFx,
			});
		}
	},
});
