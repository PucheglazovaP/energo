export type GroupListItem = {
	number: number;
	name: string;
	FKDataServers: number;
	lastModified: string;
	comment: string;
	channelsCount: number;
	isFavorite: boolean;
	rowNumber: number;
	EWorkNumber: number;
	method: string;
	unitName: string;
	unitId: number;
};
export type DevicesSortingItem = {
	value: string | number;
};
export type SortingItem = {
	searchValue: string;
	searchName: string;
};

export type SortingValueNameEd = {
	sortingV?: number | null;
	sortingN?: number | null;
	sortingEd?: number | null;
};
