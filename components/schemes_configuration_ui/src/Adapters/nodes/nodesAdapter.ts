import { NSINode } from '../../Models/Nodes/types';

import { RequestedNode } from './types';

export function nodesAdapter(response: string): NSINode[] {
	const requestedNodes: RequestedNode[] =
		JSON.parse(response).Response.Tables[0].Rows;

	const nodes: NSINode[] = requestedNodes.map((requestedNode) => ({
		id: requestedNode.ID,
		name: requestedNode.Name,
		type: requestedNode.Type,
		typeId: requestedNode.TypeID,
		lastModified: requestedNode.LastModified,
		deviceId: requestedNode.DeviceId,
		serverId: requestedNode.ServerId,
		isOpen: false,
	}));

	return nodes;
}
