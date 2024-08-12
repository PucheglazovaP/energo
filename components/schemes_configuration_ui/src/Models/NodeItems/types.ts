import { TreeItem } from './../../UI/Tree/types';

export interface NSINodeItem {
	id: number;
	defaultId: number;
	name: string;
	type: string;
	typeId: number;
	itemNumber: string | null;
	parentId: number;
	parentType: string;
	serverId: number;
	deviceId: number;
	nodeId: number;
	linkId: number;
	linkLastModified?: string;
	isOpen?: boolean;
}

export interface NodeItemsModel {
	list: NSINodeItem[];
	isLoading: boolean;
	activeNode?: TreeItem;
	search: string;
}
