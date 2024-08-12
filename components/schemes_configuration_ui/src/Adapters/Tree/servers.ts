import { Server } from '../../Models/Servers/types';
import { TreeItem } from '../../UI/Tree/types';

export function convertServersToTree(servers: Server[]): TreeItem[] {
	const tree: TreeItem[] = servers.map((server) => ({
		id: server.id,
		name: server.domenName,
		displayName: server.name,
		parentId: undefined,
		type: 'server',
		isLast: false,
		isOpen: server.isOpen,
	}));
	return tree;
}
