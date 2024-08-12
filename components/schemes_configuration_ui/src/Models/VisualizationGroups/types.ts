import { UserId } from '../../Shared/types';
import { Module } from '../../Shared/Types/moduleName';

export interface VisualizationGroupsListParams extends UserId, Module {
	energyResourceId: number;
}

export interface DeleteVisualizationGroupParams extends UserId, Module {
	visualizationGroupId: number;
	lastModified: string;
}

export type VisualizationGroupsListResponse = {
	ID: number;
	SortOrder: number;
	ShortName: string;
	Name: string;
	Comment: string;
	FK_EnergyResources: number;
	ActiveFrom: Date;
	ActiveTo: Date;
	ID_User: string;
	ChangeDT: Date;
	LastModified: string;
};

export interface MoveVisualizationGroupSortOrder extends UserId, Module {
	fromId: number;
	toId: number;
	lastModified: string;
}

export interface VisualizationGroupList extends UserId, Module {
	visualizationGroupId: number;
	name: string;
	shortName: string;
	comment: string;
	energyResourceId: number;
	sortOrder: number;
	activeFrom: Date;
	activeTo: Date;
	changeDT: Date;
	lastModified: string;
}

export type VisualizationGroupsTable = {
	visualizationGroups: VisualizationGroupList[];
	isLoading: boolean;
	activeVisualizationGroupId: number | null;
	currentVisualizationGroupId: number;
};
