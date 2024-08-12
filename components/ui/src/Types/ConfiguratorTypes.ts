import { TreeItemType } from './index';

export interface ConfiguratorPagination {
	pageTotalCount: number;
	pageRowCount: number;
	topPageNumber: number;
	bottomPageNumber: number;
	isFirstFetching: boolean;
	paginationAvailable: boolean;
	filterMode: number;
	filterString: string | null;
	needToScroll: boolean;
	scrollbarPosition: number | null;
	scrollChannelsAvailable?: boolean;
}

export interface TreeItemsToOpen {
	itemNumber: number;
	itemType: TreeItemType;
}
