import { UserId } from '../../Shared/types';
import { Module } from '../../Shared/Types/moduleName';

export interface EditVisualizationGroupParams extends UserId, Module {
	visualizationGroupId: number | null;
	sortOrder: number;
	shortName: string;
	name: string;
	comment: string;
	energyResourceId: number;
	lastModified: string | null;
}

export type EditVisualizationGroup = {
	visualizationGroupId: number | null;
	sortOrder: number;
	shortName: string;
	name: string;
	comment: string;
	lastModified: string | null;
};

export enum EditTextName {
	Comment = 'comment',
	ShortName = 'shortName',
	Name = 'name',
}
