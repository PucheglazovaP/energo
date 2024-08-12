import { NSINodeItem } from '../../Models/NodeItems/types';

import { RequestedNodeItem } from './types';
import { formattedNSITypes } from './utils';

export function nodeItemsAdapter(response: string): NSINodeItem[] {
	const requestedNodeItems: RequestedNodeItem[] = JSON.parse(
		response,
	).Response.Tables[0].Rows.map((rowItem: RequestedNodeItem) => {
		return {
			...rowItem,
			ID: rowItem.ID + rowItem.ID_Node * 1000,
			DefaultID: rowItem.ID,
			TYPE: formattedNSITypes[rowItem.TYPE],
		};
	});
	const nodeItems: NSINodeItem[] = [];

	requestedNodeItems.forEach((requestedNodeItem) => {
		if (requestedNodeItem.PID !== null) {
			const parentData = requestedNodeItems.find((requestedItem) => {
				return requestedItem.DefaultID === requestedNodeItem.PID;
			}) as RequestedNodeItem;

			const displayName: string =
				![
					'equipment_pieces',
					'equipment_piece',
					'channels',
					'channel_groups',
				].includes(requestedNodeItem.TYPE) && requestedNodeItem.Number
					? `${requestedNodeItem.Number}. ${requestedNodeItem.Name}`
					: requestedNodeItem.Name;

			nodeItems.push({
				id: requestedNodeItem.ID,
				defaultId: requestedNodeItem.DefaultID,
				name: displayName,
				type: requestedNodeItem.TYPE,
				typeId: requestedNodeItem.ID_TYPE ?? 0,
				itemNumber: requestedNodeItem.Number,
				parentId:
					parentData.ID_TYPE === 4 ? requestedNodeItem.ID_Node : parentData.ID,
				parentType:
					parentData.TYPE === 'accounting_node' ? 'node' : parentData.TYPE,
				serverId: requestedNodeItem.ServerId,
				deviceId: requestedNodeItem.DeviceId,
				nodeId: requestedNodeItem.ID_Node,
				linkId: requestedNodeItem.ID_LINK ?? 0,
				linkLastModified: requestedNodeItem.Link_LastModified,
				isOpen: false,
			});
		}
	});

	return nodeItems;
}
