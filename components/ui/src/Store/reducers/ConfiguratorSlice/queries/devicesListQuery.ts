import { COMMON_PAGE_ROW_COUNT } from '../../../../Const';
import { getOutputParameters } from '../../../../Const/utils';

import { DeviceListQuery } from './types';

export function devicesListQuery({
	pageNumber = 1,
	pageRowCount = COMMON_PAGE_ROW_COUNT,
	filterMode = 1,
	filterStr = null,
	serverId = null,
	mode,
	userId,
	sortOrder,
}: DeviceListQuery) {
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
				Value: mode,
				Direction: 'Input',
			},
			{
				Name: '@OrderMode',
				DbType: 'int',
				Value: sortOrder,
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
				Name: '@FirstRow',
				DbType: 'int',
				Value: null,
				Direction: 'Output',
				Size: 64,
			},
			{
				Name: '@SelectRow',
				DbType: 'int',
				Value: null,
				Direction: 'Output',
				Size: 64,
			},
			...getOutputParameters('textErr', 'textWarn'),
		],
	};
}
