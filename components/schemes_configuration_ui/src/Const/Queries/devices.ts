import { DevicesParams, FilteredDevicesParams } from '../../Shared/types';
import { ModuleName } from '../../Shared/Types/moduleName';

export function getDevicesListQuery({
	pageNumber = 2,
	pageRowCount = 100,
	filterMode = 1,
	filterStr = '',
	serverId = null,
	userId,
}: DevicesParams) {
	return {
		Sql: '[appl_tags].[Get_ListDevices]',
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
				Value: 1,
				Direction: 'Input',
			},
			{
				Name: '@OrderMode',
				DbType: 'int',
				Value: 1,
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
				Name: '@SelectRow',
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
				Size: '64',
			},
			{
				Name: '@PageNumberOut',
				DbType: 'int',
				Value: null,
				Direction: 'Output',
				Size: '64',
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

export function getFilteredDevicesListQuery({
	filterStr = '',
	moduleName = ModuleName.Test,
	userId,
}: FilteredDevicesParams) {
	return {
		Sql: '[NSI].[NSIConfiguration].[Get_ListDevicesByFilter]',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@FilterStr',
				DbType: 'String',
				Value: filterStr,
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
