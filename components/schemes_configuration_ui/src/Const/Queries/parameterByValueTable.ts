import {
	DeleteParameterParams,
	MoveParameterSortOrder,
	ParameterByValueListParams,
} from '../../Models/ParametersByValueReports/types';
import { ModuleName } from '../../Shared/Types/moduleName';

export function getParameterByValueListQuery({
	energyResourceId = 1,
	userId,
	moduleName = ModuleName.Test,
}: ParameterByValueListParams) {
	return {
		Sql: '[EnergyConsum_Reports].[dbo].Get_DailyPoints',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@ID',
				DbType: 'int',
				Value: null,
				Direction: 'Input',
			},
			{
				Name: '@FK_EnergyResources',
				DbType: 'int',
				Value: energyResourceId,
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

export function deleteParameterQuery({
	id,
	lastModified,
	userId,
	moduleName = ModuleName.Test,
}: DeleteParameterParams) {
	return {
		Sql: '[EnergyConsum_Reports].[dbo].Del_DailyPoints',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@ID',
				DbType: 'int',
				Value: id,
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
export function moveParameterOrderQuery({
	fromId,
	toId,
	lastModified,
	userId,
	moduleName = ModuleName.Test,
}: MoveParameterSortOrder) {
	return {
		Sql: '[EnergyConsum_Reports].[dbo].Upd_DailyPointsSortOrder',
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
