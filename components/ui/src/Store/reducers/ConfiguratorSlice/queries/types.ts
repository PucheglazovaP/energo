import { SortOrderTypes } from '../../../../Types/SortOrderTypes';

export interface ChannelListQuery extends SortOrderTypes {
	pageNumber: number | null;
	pageRowCount: number | null;
	mode: number;
	serverId: number | null;
	fkGroup?: number | null;
	fkDevice?: number | null;
	fkChannel?: number | null;
	fromNumber?: number | null;
	toNumber?: number | null;
	userId?: string;
}

export interface DeviceListQuery extends SortOrderTypes {
	pageNumber: number;
	pageRowCount: number;
	filterMode: number;
	filterStr: string | null;
	serverId: number | null;
	mode: number;
	userId?: string;
}

export interface GroupListQuery extends SortOrderTypes {
	pageNumber: number;
	pageRowCount: number;
	filterStr: string | null;
	fkChannel: number | null;
	serverId: number | null;
	filterMode: number;
	mode: number;
	userId?: string;
}

export interface ServerListQuery {
	userId?: string;
}
