import { UserId } from '../../Shared/types';
import { Module } from '../../Shared/Types/moduleName';
import { AccountingNode } from '../AccountingNode/types';

export type Point = {
	id: number;
	shortName: string;
	captionName: string;
	name: string;
	channelNumber: number;
	channelName: string;
	deviceNumber: number;
	coefficient: number;
	comment: string;
	deviceName: string;
	channelState: string;
	linkedPointId: number | null;
	linkedPointName: string | null;
	linkedPointRatio: number | null;
	linkedPointComment: string | null;
	channels: PointChannel[];
	lastModified: string;
	sortOrder: number;
	isCollapsed: boolean;
	isActive: boolean;
	energyResource: number;
};

export type PointChannel = {
	id: number;
	pointId: number;
	number: number;
	name: string;
	baseValue: number;
	deviceNumber: number;
	deviceName: string;
	coefficient: number;
	startTime: string;
	endTime: string;
	lastModified: string;
	canDelete: boolean;
};
export type AccountingNodeMethodsResponse = {
	ID: number;
	Name: string;
};

export interface MovePointsSortOrder extends UserId, Module {
	fromId: number;
	toId: number;
	lastModified: string;
}

export type TextFilters = {
	shortName: string;
	name: string;
	channelName: string;
	channelNumber: string;
	deviceNumber: string;
	coefficient: string;
};

export type SelectedFilterOption = 'Да' | 'Нет';

export type Accessors =
	| 'captionName'
	| 'name'
	| 'channelNumber'
	| 'deviceNumber'
	| 'coefficient'
	| '';

export type ActivePoint = {
	id: number;
	isActive: boolean;
};

export type PointCoefficient = {
	pointId: number;
	coefficient: number;
};

export interface EditPointParams extends UserId, Module {
	name: string;
	shortName: string;
	comment: string;
	captionName: string;
	linkedPointId: number | null;
	linkedPointName: string | null;
	linkedPointRatio: number | null;
	linkedPointComment: string | null;
	lastModified: string;
	energyResource: number;
	sortOrder?: number;
	id?: number;
	prevId?: number;
}
export interface SaveAccountingNodeParams
	extends AccountingNode,
		UserId,
		Module {}

export interface DeleteParams extends UserId, Module {
	id: number;
	lastModified: string;
}

export interface CreatePointChannelParams extends UserId, Module {
	pointId: number;
	channelNumber: number;
}

export interface EditPointChannelParams extends UserId, Module {
	id: number;
	number: number;
	baseValue: number;
	coefficient: number;
	startTime: string | null;
	endTime: string | null;
	lastModified: string;
}

export type SearchTextParams = {
	captionName: string;
	name: string;
	channelNumber: string;
	channelName: string;
	deviceNumber: string;
	coefficient: string;
};

export enum SearchTextName {
	captionName = 'captionName',
	name = 'name',
	channelNumber = 'channelNumber',
	channelName = 'channelName',
	deviceNumber = 'deviceNumber',
	coefficient = 'coefficient',
}

export enum EditTextName {
	Comment = 'comment',
	ShortName = 'shortName',
	Name = 'name',
	CaptionName = 'captionName',
}

export interface GetPointsAction extends UserId, Module {
	energyResource: number | null;
	pointId?: number | null;
}

export type FocusOnPoint = { focusPointId: number | null };

export interface EnergyResourceUpdateParams extends UserId, Module {
	energyResourceId: number;
	baseHour: number;
}

export interface PointChannelsListParams extends UserId, Module {
	point: number;
}
