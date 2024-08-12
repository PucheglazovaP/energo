import { FilterOptions, SearchFilters, UserId } from '../../Shared/types';
import { Module } from '../../Shared/Types/moduleName';

export interface ParameterByValueListParams extends UserId, Module {
	energyResourceId: number;
}

export interface DeleteParameterParams extends UserId, Module {
	id: number;
	lastModified: string;
}

export type ParameterByValueListResponse = {
	ID: number;
	FK_DailyPointsGroups: number;
	GroupName: string;
	Name: string;
	ShortName: string;
	SortOrder: number;
	SortOrderGroup: number;
	Comment: string;
	FK_Points: number;
	PointName: string;
	FK_Methods: number;
	MethodName: string;
	FK_CalculateMethods: number;
	CalcName: string;
	FK_EnergyResources: number;
	RoundToDig: number;
	HourShift: number;
	ActiveFrom: Date;
	ActiveTo: Date;
	FK_LinkedDailyPoints: number;
	LinkedColumns: number;
	ID_User: string;
	ChangeDT: Date;
	LastModified: string;
};

export interface ParametersByValueList {
	parameterId: number;
	dailyPointGroupsId: number | null;
	visualizationGroupName: string;
	name: string;
	shortName: string;
	sortOrder: number;
	sortOrderGroup: number;
	comment: string;
	pointId: number | null;
	pointName: string;
	methodId: number;
	methodName: string;
	calculateMethodId: number;
	calcName: string;
	energyResourceId: number;
	precision: number;
	hourShift: number;
	activeFrom: Date;
	activeTo: Date;
	linkedDailyPointsId: number | null;
	linkedColumns: number;
	changeDT: Date;
	lastModified: string;
}

export type ParameterByValueTable = {
	parametersList: ParametersByValueList[];
	searchFilters: SearchFilters;
	isLoading: boolean;
	parametersTypeOptions: FilterOptions[];
	selectedParameterTypes: string[];
	modalLinkedPointId: number | null;
	toggledSections: string[];
};

export interface MoveParameterSortOrder extends UserId, Module {
	fromId: number;
	toId: number;
	lastModified: string;
}
