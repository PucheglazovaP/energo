import { COMMON_PAGE_ROW_COUNT } from '../../../../Const';

import { ChannelListQuery } from './types';

export function channelsListQuery({
	pageNumber = 1,
	pageRowCount = COMMON_PAGE_ROW_COUNT,
	mode,
	serverId,
	fkGroup = null,
	fkDevice = null,
	fkChannel = null,
	fromNumber = null,
	toNumber = null,
	userId,
	sortOrder,
}: ChannelListQuery) {
	return {
		Sql: '[appl_tags].[Get_ListChannels]',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@ID_DataServers',
				DbType: 'int',
				Value: serverId,
				Direction: 'Input',
			},
			{
				Name: '@Number_From',
				DbType: 'int',
				Value: fromNumber,
				Direction: 'Input',
			},
			{
				Name: '@Number_To',
				DbType: 'int',
				Value: toNumber,
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
				Name: '@ID_User',
				DbType: 'String',
				Value: userId,
				Direction: 'Input',
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
				Name: '@FK_Group',
				DbType: 'int',
				Value: fkGroup,
				Direction: 'Input',
			},
			{
				Name: '@FK_Device',
				DbType: 'int',
				Value: fkDevice,
				Direction: 'Input',
			},
			{
				Name: '@FK_Channel',
				DbType: 'int',
				Value: fkChannel,
				Direction: 'Input',
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
		],
	};
}
