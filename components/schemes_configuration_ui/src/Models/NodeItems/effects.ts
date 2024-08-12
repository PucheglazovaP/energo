import { toast } from 'react-toastify';
import { createEffect } from 'effector';

import { nodeItemsAdapter } from '../../Adapters/nodeItems';
import {
	getNodeItemsListQuery,
	linkEquipmentPieceToNodeQuery,
	updateChannelNodeQuery,
	updateEquipmentPieceNodeQuery,
} from '../../Const/Queries/nodeItems';
import {
	NodeItemsActions,
	NodeItemsParams,
} from '../../Const/Queries/nodeItems/types';
import {
	LinkEquipmentPieceParams,
	UpdateChannelNodeParams,
	UpdateEquipmentPieceNodeParams,
} from '../../Shared/types';
import { RpcError, rpcQuery } from '../../Utils/requests';

import { addNodeItemsList, setNodeItemsList } from './events';
import { NSINodeItem } from './types';

export const getNodeItemsListFx = createEffect<NodeItemsParams, NSINodeItem[]>(
	'Get node items list effect',
	{
		handler: async (params) => {
			const nodeItems = await rpcQuery<NSINodeItem[]>(
				getNodeItemsListQuery(params),
				nodeItemsAdapter,
			);

			return nodeItems;
		},
	},
);

export const updateChannelNodeFx = createEffect(
	async (params: UpdateChannelNodeParams) => {
		try {
			await rpcQuery<void>(updateChannelNodeQuery(params));
		} catch (err) {
			if (err instanceof RpcError) {
				err.toastMessage();
			} else {
				toast.error('Что-то пошло не так при смене узла учета для канала');
			}
		}
	},
);

export const updateEquipmentPieceNodeFx = createEffect(
	async (params: UpdateEquipmentPieceNodeParams) => {
		try {
			await rpcQuery<void>(updateEquipmentPieceNodeQuery(params));
		} catch (err) {
			if (err instanceof RpcError) {
				err.toastMessage();
			} else {
				toast.error(
					'Что-то пошло не так при смене узла учета для единицы оборудования',
				);
			}
		}
	},
);

export const linkEquipmentPieceFx = createEffect(
	async (params: LinkEquipmentPieceParams) => {
		try {
			await rpcQuery<void>(linkEquipmentPieceToNodeQuery(params));
		} catch (err) {
			if (err instanceof RpcError) {
				err.toastMessage();
			} else {
				toast.error('Что-то пошло не так при привязке единицы оборудования');
			}
		}
	},
);

getNodeItemsListFx.done.watch(({ result, params }) => {
	if (params.action === NodeItemsActions.None) {
		return;
	}
	if (params.action === NodeItemsActions.Add) {
		addNodeItemsList(result);
	} else {
		setNodeItemsList(result);
	}
});
