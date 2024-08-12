import { OptimizedPagination } from '../../Shared/types';
import { TreeItem } from '../../UI/Tree/types';

export type ChannelsModel = {
	list: Channel[];
	isLoading: boolean;
	pagination: OptimizedPagination;
	activeNode?: TreeItem;
	search: string;
};

export type Channel = {
	id: number;
	name: string;
	serverId: number;
	lastModified: string;
	unitId: number; // measurement unit id
	unit: string; // measurement unit
	method: string; // name of the processing method on the interval
	methodId: number; // id of the processing method on the interval
	typesStorageId: number;
	typesStorage: string;
	groupsList: string;
	koefList: string;
	isFavorite: 0 | 1;
	order: number;
	deviceId: number;
	isOpen?: boolean;
	isConsumption: boolean;
};
