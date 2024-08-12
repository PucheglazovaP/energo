/* global Stringified */
import { User } from '../../../Types/UserTypes';

export enum ItemExistenceRpc {
	NONE,
	EXIST,
}

export enum HistoryElementType {
	GROUP,
	CHANNEL,
	DEVICE,
}

export enum HistoryElementTypeName {
	GROUP = 'Группа',
	CHANNEL = 'Канал',
	DEVICE = 'Прибор',
}

export enum HistoryType {
	GENERAL = 'general',
	ELEMENT = 'element',
}

export type HistoryStatus = 'CREATED' | 'UPDATED' | 'DELETED';
export enum HistoryElementStatus {
	CREATED = 'Создано',
	UPDATED = 'Изменено',
	DELETED = 'Удалено',
}

export interface HistoryChangesList {
	name: string;
	prev: string | number | null;
	next: string | number | null;
}

export interface History {
	itemType?: keyof typeof HistoryElementType;
	id: number;
	name: string;
	user: string;
	validFrom: string;
	validTo: string;
	lastModifiedId: string;
	status: HistoryElementStatus;
	isCollapsed?: boolean;
	changesList: HistoryChangesList[];
	moduleName: string;
}

export type HistoryResponse = {
	ACC_NAME: string;
	ChangesList: Stringified<HistoryChangesListResponse[]>;
	ItemType?: HistoryElementType;
	LastModified: string;
	Name: string;
	Number: number;
	Oper: HistoryStatus;
	ValidFrom: string;
	ValidTo: string;
	Module_name: string;
};

export interface HistoryChangesListResponse {
	ParamName: string;
	CurValue: string | number | null;
	PrevValue: string | number | null;
}

export interface HistoryGeneralParams extends User {
	fromDate: string;
	toDate: string;
	isGroup: ItemExistenceRpc;
	isChannel: ItemExistenceRpc;
	isDevice: ItemExistenceRpc;
	pageRowCount: number;
	pageNumber: number;
}

export interface HistoryElementParams extends User {
	path: string;
	id: number;
	fromDate: string;
	toDate: string;
}
