import {
	DeleteVisualizationGroupParams,
	MoveVisualizationGroupSortOrder,
	VisualizationGroupsListParams,
} from '../../Models/VisualizationGroups/types';
import { ModuleName } from '../../Shared/Types/moduleName';

export function getVisualizationGroupsListQuery({
	energyResourceId,
	userId,
	moduleName = ModuleName.Test,
}: VisualizationGroupsListParams) {
	return {
		Sql: '[EnergyConsum_Reports].[dbo].Get_DailyPointsGroups',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@FK_EnergyResources',
				DbType: 'int',
				Value: energyResourceId,
				Direction: 'Input',
				Size: '64',
			},
			{
				Name: '@ID_User',
				DbType: 'String',
				Value: userId,
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
		],
	};
}

export function deleteVisualizationGroupQuery({
	visualizationGroupId,
	lastModified,
	userId,
	moduleName = ModuleName.Test,
}: DeleteVisualizationGroupParams) {
	return {
		Sql: '[EnergyConsum_Reports].[dbo].Del_DailyPointsGroup',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@ID',
				DbType: 'int',
				Value: visualizationGroupId,
				Direction: 'Input',
			},
			{
				Name: '@LastModified',
				DbType: 'Guid',
				Value: lastModified,
				Direction: 'Input',
			},
			{
				Name: '@ID_User',
				DbType: 'String',
				Value: userId,
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
		],
	};
}

// fromId айдишник элемента, который двигаем
// toId айдишник элемента, после которым ставим
export function moveVisualizationGroupOrderQuery({
	fromId,
	toId,
	lastModified,
	userId,
	moduleName = ModuleName.Test,
}: MoveVisualizationGroupSortOrder) {
	return {
		Sql: '[EnergyConsum_Reports].[dbo].Upd_DailyPointsGroupSortOrder',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@ID',
				DbType: 'int',
				Value: fromId,
				Direction: 'Input',
			},
			{
				Name: '@PrevID',
				DbType: 'int',
				Value: toId,
				Direction: 'Input',
			},
			{
				Name: '@LastModified',
				DbType: 'Guid',
				Value: lastModified,
				Direction: 'Input',
			},
			{
				Name: '@ID_User',
				DbType: 'String',
				Value: userId,
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
				Value: '',
				Direction: 'Output',
			},
		],
	};
}
