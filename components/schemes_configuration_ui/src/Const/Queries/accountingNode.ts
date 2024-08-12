import { SaveAccountingNodeParams } from '../../Models/Points/types';
import { AccountingNodeMethods } from '../../Shared/types';
import { ModuleName } from '../../Shared/Types/moduleName';

export function updateAccountingNodeQuery({
	parameterId,
	userId,
	dailyPointGroupsId,
	linkedDailyPointsId,
	name,
	shortName,
	methodId,
	calculateMethodId,
	precision,
	hourShift,
	energyResourceId,
	lastModified,
	comment,
	moduleName = ModuleName.Test,
}: SaveAccountingNodeParams) {
	return {
		Sql: '[EnergyConsum_Reports].[dbo].Upd_DailyPoints',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@ID',
				DbType: 'int',
				Value: parameterId,
				Direction: 'Input',
			},
			{
				Name: '@FK_Methods',
				DbType: 'int',
				Value: methodId,
				Direction: 'Input',
			},
			{
				Name: '@FK_CalculateMethods',
				DbType: 'int',
				Value: calculateMethodId,
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
				Name: '@FK_DailyPointsGroups',
				DbType: 'int',
				Value: dailyPointGroupsId,
				Direction: 'Input',
			},
			{
				Name: '@RoundToDig',
				DbType: 'int',
				Value: precision,
				Direction: 'Input',
			},
			{
				Name: '@HourShift',
				DbType: 'int',
				Value: hourShift,
				Direction: 'Input',
			},
			{
				Name: '@FK_LinkedDailyPoints',
				DbType: 'int',
				Value: linkedDailyPointsId,
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
				Name: '@LastModified',
				DbType: 'Guid',
				Value: lastModified,
				Direction: 'Input',
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
export function createAccountingNodeQuery({
	userId,
	dailyPointGroupsId,
	linkedDailyPointsId,
	name,
	shortName,
	methodId,
	calculateMethodId,
	precision,
	hourShift,
	energyResourceId,
	comment,
	pointId,
	moduleName = ModuleName.Test,
}: SaveAccountingNodeParams) {
	return {
		Sql: '[EnergyConsum_Reports].[dbo].Ins_DailyPoints',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@FK_Points',
				DbType: 'int',
				Value: pointId,
				Direction: 'Input',
			},
			{
				Name: '@FK_Methods',
				DbType: 'int',
				Value: methodId,
				Direction: 'Input',
			},
			{
				Name: '@FK_CalculateMethods',
				DbType: 'int',
				Value: calculateMethodId,
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
				Name: '@FK_DailyPointsGroups',
				DbType: 'int',
				Value: dailyPointGroupsId,
				Direction: 'Input',
			},
			{
				Name: '@RoundToDig',
				DbType: 'int',
				Value: precision,
				Direction: 'Input',
			},
			{
				Name: '@HourShift',
				DbType: 'int',
				Value: hourShift,
				Direction: 'Input',
			},
			{
				Name: '@FK_LinkedDailyPoints',
				DbType: 'int',
				Value: linkedDailyPointsId,
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
export function getAccountingNodeMethodsQuery({
	userId,
	moduleName = ModuleName.Test,
}: AccountingNodeMethods) {
	return {
		Sql: '[EnergyConsum_Reports].[dbo].Get_Methods',
		CommandType: 'StoredProcedure',
		Parameters: [
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

export function getAccountingNodeCalculateMethodsQuery({
	userId,
	moduleName = ModuleName.Test,
}: AccountingNodeMethods) {
	return {
		Sql: '[EnergyConsum_Reports].[dbo].Get_CalculateMethods',
		CommandType: 'StoredProcedure',
		Parameters: [
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
