import { DeviceArchiveParams, DeviceParams } from '../../Shared/types';
import { ModuleName } from '../../Shared/Types/moduleName';

export function getDeviceParametersQuery({ number = 0 }: DeviceParams) {
	return {
		Sql: '[Energy].[energy].[Get_Архивы_SprPr_ПараметрыИЗначения]',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@num_pr',
				DbType: 'int',
				Value: number,
				Direction: 'Input',
			},
			{
				Name: '@tsys',
				DbType: 'int',
				Value: -1,
				Direction: 'Input',
			},
		],
	};
}

export function updateDeviceParametersQuery({
	number = 0,
	value = '',
	name = '',
	moduleName = ModuleName.Test,
	userId,
}: DeviceParams) {
	return {
		Sql: '[Energy].[energy].[InsUpd_Архивы_SprPr_ПараметрыИЗначенияСПроверкойПрав]',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@num_pr',
				DbType: 'int',
				Value: number,
				Direction: 'Input',
			},
			{
				Name: '@param_name',
				DbType: 'String',
				Value: name,
				Direction: 'Input',
			},
			{
				Name: '@param_value',
				DbType: 'String',
				Value: value,
				Direction: 'Input',
			},
			{
				Name: '@tsys',
				DbType: 'int',
				Value: '-1',
				Direction: 'Input',
			},
			{
				Name: '@Module_name',
				DbType: 'String',
				Value: moduleName,
				Direction: 'Input',
			},
			{
				Name: '@ID_User',
				DbType: 'String',
				Value: userId,
				Direction: 'Input',
			},
		],
	};
}
export function getDevicesGroupsArchiveRepQuery({
	number = 0,
	moduleName = ModuleName.Test,
	userId,
}: DeviceArchiveParams) {
	return {
		Sql: '[EMConfiguration].[appl_tags].Get_DevicesGroups_ArchiveRep',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@Number',
				DbType: 'int',
				Value: number,
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
