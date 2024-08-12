import { TreeItem } from './../../UI/Tree/types';

export interface NSINode {
	id: number;
	name: string;
	type: string;
	typeId: number;
	lastModified: string;
	deviceId: number;
	serverId: number;
	isOpen?: boolean;
}

export interface NodesModel {
	list: NSINode[];
	isLoading: boolean;
	activeNode?: TreeItem;
	search: string;
}
