import { DEFAULT_ENERGY_RESOURCES_ID } from '../../Containers/ParameterByValueTable/constants';
import { EditVisualizationGroupParams } from '../../Models/EditVisualizationGroupForm/types';
import { ModuleName } from '../../Shared/Types/moduleName';

export function addVisualizationGroupQuery(
	addVisualizationGroupData: EditVisualizationGroupParams,
) {
	const {
		shortName,
		name,
		comment,
		energyResourceId = DEFAULT_ENERGY_RESOURCES_ID,
		userId,
		moduleName = ModuleName.Test,
	} = addVisualizationGroupData;
	return {
		Sql: '[EnergyConsum_Reports].[dbo].Ins_DailyPointsGroups',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@SortOrder',
				DbType: 'int',
				Value: 1,
				Direction: 'Input',
			},
			{
				Name: '@ShortName',
				DbType: 'String',
				Value: shortName,
				Direction: 'Input',
			},
			{
				Name: '@Name',
				DbType: 'String',
				Value: name,
				Direction: 'Input',
			},
			{
				Name: '@Comment',
				DbType: 'String',
				Value: comment,
				Direction: 'Input',
			},
			{
				Name: '@FK_EnergyResources',
				DbType: 'int',
				Value: energyResourceId,
				Direction: 'Input',
			},
			{
				Name: '@ActiveFrom',
				DbType: 'Date',
				Value: null,
				Direction: 'Input',
			},
			{
				Name: '@ActiveTo',
				DbType: 'Date',
				Value: null,
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

export function editVisualizationGroupQuery(
	editVisualizationGroupData: EditVisualizationGroupParams,
) {
	const {
		visualizationGroupId,
		sortOrder,
		shortName,
		name,
		comment,
		lastModified,
		userId,
		moduleName = ModuleName.Test,
	} = editVisualizationGroupData;
	return {
		Sql: '[EnergyConsum_Reports].[dbo].Upd_DailyPointsGroups',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@ID',
				DbType: 'int',
				Value: visualizationGroupId,
				Direction: 'Input',
			},
			{
				Name: '@SortOrder',
				DbType: 'int',
				Value: sortOrder,
				Direction: 'Input',
			},
			{
				Name: '@ShortName',
				DbType: 'String',
				Value: shortName,
				Direction: 'Input',
			},
			{
				Name: '@Name',
				DbType: 'String',
				Value: name,
				Direction: 'Input',
			},
			{
				Name: '@Comment',
				DbType: 'String',
				Value: comment,
				Direction: 'Input',
			},
			{
				Name: '@ActiveFrom',
				DbType: 'Date',
				Value: null,
				Direction: 'Input',
			},
			{
				Name: '@ActiveTo',
				DbType: 'Date',
				Value: null,
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
