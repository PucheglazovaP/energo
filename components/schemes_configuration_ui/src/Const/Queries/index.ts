import { ModuleName } from '../../Shared/Types/moduleName';
import { COMMON_PAGE_ROW_COUNT } from '../index';
export * from './devices';
export * from './servers';

export const MethodsQuery = {
	Sql: '[dict].[Get_Methods]',
	CommandType: 'StoredProcedure',
	Parameters: [],
};
export const StorageTypesQuery = {
	Sql: '[dict].[Get_TypesStorage]',
	CommandType: 'StoredProcedure',
	Parameters: [],
};
export const UnitsQuery = {
	Sql: '[dict].[Get_UnitsList]',
	CommandType: 'StoredProcedure',
	Parameters: [],
};
export const UnitsClassificationsQuery = {
	Sql: '[dict].[Get_UnitsClassifications]',
	CommandType: 'StoredProcedure',
	Parameters: [],
};

export const UnitsClassificationSectionQuery = {
	Sql: '[dict].[Get_UnitsClassificationsSection]',
	CommandType: 'StoredProcedure',
	Parameters: [
		{
			Name: '@ID_Parent',
			DbType: 'int',
			Value: 1,
			Direction: 'Input',
		},
	],
};
export const UnitsOfUnitsClassificationsSectionQuery = {
	Sql: '[dict].[Get_UnitsOfUnitsClassificationsSection]',
	CommandType: 'StoredProcedure',
	Parameters: [
		{
			Name: '@ID_Section',
			DbType: 'int',
			Value: 10,
			Direction: 'Input',
		},
	],
};

export function getCreateGroupsQuery(
	name: string,
	number: number,
	unit: number,
	method: number,
	typeStorage: number,
	count: number = 1,
	userId: string,
	moduleName = ModuleName.Test,
) {
	return {
		Sql: '[appl_tags].[Ins_CreateNewGroups]',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@Number',
				DbType: 'int',
				Value: number,
				Direction: 'Input',
			},
			{
				Name: '@Count',
				DbType: 'int',
				Value: count,
				Direction: 'Input',
			},
			{
				Name: '@NamePref',
				DbType: 'String',
				Value: name,
				Direction: 'Input',
			},
			{
				Name: '@FK_Units',
				DbType: 'int',
				Value: unit,
				Direction: 'Input',
			},
			{
				Name: '@FK_Methods',
				DbType: 'int',
				Value: method,
				Direction: 'Input',
			},
			{
				Name: '@FK_TypesStorage',
				DbType: 'int',
				Value: typeStorage,
				Direction: 'Input',
			},
			{
				Name: '@FK_DataServers',
				DbType: 'int',
				Value: 2,
				Direction: 'Input',
			},
			{
				Name: '@Formula',
				DbType: 'Boolean',
				Value: false,
				Direction: 'Input',
			},
			{
				Name: '@ActiveFormula',
				DbType: 'Boolean',
				Value: false,
				Direction: 'Input',
			},
			{
				Name: '@ID_User_Owner',
				DbType: 'String',
				Value: userId,
				Direction: 'Input',
			},
			{
				Name: '@ID_User',
				DbType: 'String',
				Value: userId,
				Direction: 'Input',
			},
			{
				Name: '@Number_EWork',
				DbType: 'int',
				Value: null,
				Direction: 'Input',
			},
			{
				Name: '@Module_name',
				DbType: 'String',
				Value: moduleName,
				Direction: 'Input',
			},
			{
				Name: '@Err',
				DbType: 'int',
				Value: null,
				Direction: 'Output',
				Size: '64',
			},
			{
				Name: '@TextErr',
				DbType: 'String',
				Value: null,
				Direction: 'Output',
				Size: '2000',
			},
			{
				Name: '@LogOperation',
				DbType: 'String',
				Value: null,
				Direction: 'Output',
				Size: '4000',
			},
		],
	};
}

export function getGroupsListQuery(
	pageNumber: number = 1,
	pageRowCount: number = COMMON_PAGE_ROW_COUNT,
	filterStr: string | null = null,
	fkChannel: number | null = null,
	serverId: number | null,
	filterMode: number,
	orderMode: number,
	mode: number,
	userId: string,
) {
	return {
		Sql: '[appl_tags].[Get_ListGroups]',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@ID_DataServers',
				DbType: 'int',
				Value: serverId,
				Direction: 'Input',
			},
			{
				Name: '@FilterMode',
				DbType: 'int',
				Value: filterMode,
				Direction: 'Input',
			},
			{
				Name: '@FilterStr',
				DbType: 'String',
				Value: filterStr,
				Direction: 'Input',
			},
			{
				Name: '@Mode',
				DbType: 'int',
				Value: mode,
				Direction: 'Input',
			},
			{
				Name: '@OrderMode',
				DbType: 'int',
				Value: orderMode,
				Direction: 'Input',
			},
			{
				Name: '@FK_Channel',
				DbType: 'int',
				Value: fkChannel,
				Direction: 'Input',
			},
			{
				Name: '@ID_User',
				DbType: 'String',
				Value: userId,
				Direction: 'Input',
			},
			{
				Name: '@PageRowCount',
				DbType: 'int',
				Value: pageRowCount,
				Direction: 'Input',
			},
			{
				Name: '@PageNumber',
				DbType: 'int',
				Value: pageNumber,
				Direction: 'Input',
			},
			{
				Name: '@FirstRow',
				DbType: 'int',
				Value: null,
				Direction: 'Output',
				Size: '64',
			},
			{
				Name: '@PageTotalCount',
				DbType: 'int',
				Value: null,
				Direction: 'Output',
				Size: 64,
			},
			{
				Name: '@PageNumberOut',
				DbType: 'int',
				Value: null,
				Direction: 'Output',
				Size: 64,
			},
			{
				Name: '@Err',
				DbType: 'int',
				Value: null,
				Direction: 'Output',
				Size: 64,
			},
			{
				Name: 'TextErr',
				DbType: 'String',
				Value: null,
				Direction: 'Output',
				Size: 2000,
			},
		],
	};
}

export function fetchVersionsListQuery() {
	return {
		Sql: '[Редактор].[dbo].Get_СписокВерсий',
		CommandType: 'StoredProcedure',
		Parameters: [],
	};
}

export function getKoefList(unitId: number) {
	return {
		Sql: '[dict].[Get_RelatedUnits]',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@ID_Unit',
				DbType: 'int',
				Value: unitId,
				Direction: 'Input',
			},
		],
	};
}
