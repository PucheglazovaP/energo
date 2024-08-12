import { COMMON_PAGE_ROW_COUNT } from '../../../../Const';

import { GroupListQuery } from './types';

export function groupsListQuery({
	pageNumber = 1,
	pageRowCount = COMMON_PAGE_ROW_COUNT,
	filterStr = null,
	fkChannel = null,
	serverId,
	filterMode,
	mode,
	userId,
	sortOrder,
}: GroupListQuery) {
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
				Value: sortOrder,
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
