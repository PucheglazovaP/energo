import { OptimizedPagination } from '../../Shared/types';
import { TreeItem } from '../../UI/Tree/types';

export type DevicesModel = {
	list: Device[];
	isLoading: boolean;
	pagination: OptimizedPagination;
	activeNode?: TreeItem;
};

export type Device = {
	id: number;
	name: string;
	serverId: number;
	lastModified: string;
	comment: string | null;
	channelsList: string | null;
	isFavorite: 0 | 1;
	order: number;
	isOpen?: boolean;
};

export type DevicesArchiveList = {
	number: number;
	name: string;
	deviceType: string;
};
