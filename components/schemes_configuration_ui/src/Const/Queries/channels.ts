import { format } from 'date-fns';

import { ChannelsChartDataParams, ChannelsParams } from '../../Shared/types';

export function getChannelsListQuery(params: ChannelsParams) {
	const {
		deviceId = null,
		serverId = null,
		mode = 1,
		pageNumber = 1,
		pageRowCount = 0,
		searchFrom = null,
		userId,
	} = params;
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
				Value: searchFrom,
				Direction: 'Input',
			},
			{
				Name: '@Number_To',
				DbType: 'int',
				Value: null,
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
				Value: 1,
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
				Direction: 'InputOutput',
				Size: '64',
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
				Name: '@PageNumberOut',
				DbType: 'int',
				Value: 1,
				Direction: 'InputOutput',
				Size: '64',
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
				Name: '@FK_Group',
				DbType: 'int',
				Value: null,
				Direction: 'Input',
			},
			{
				Name: '@FK_Device',
				DbType: 'int',
				Value: deviceId,
				Direction: 'Input',
			},
			{
				Name: '@FK_Channel',
				DbType: 'int',
				Value: null,
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
export function getChannelsChartDataQuery(params: ChannelsChartDataParams) {
	const {
		startDateTime,
		endDateTime,
		discrete = 'C',
		channelNumber = 0,
		isMoscowTimeZone = false,
		round = 10,
		canDiagUse = 1,
	} = params;
	return {
		Sql: '[Energy].[energy].Get_АРМ_ДанныеПоКаналуИТипуЗаПериод',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@from_dat',
				DbType: 'String',
				Value: format(startDateTime, 'yyyy.MM.dd HH:mm:ss'),
				Direction: 'Input',
			},
			{
				Name: '@to_dat',
				DbType: 'String',
				Value: format(endDateTime, 'yyyy.MM.dd HH:mm:ss'),
				Direction: 'Input',
			},
			{
				Name: '@num_cana',
				DbType: 'int',
				Value: channelNumber,
				Direction: 'Input',
			},
			{
				Name: '@typ',
				DbType: 'String',
				Value: discrete,
				Direction: 'Input',
			},
			{ Name: '@round', DbType: 'int', Value: round, Direction: 'Input' },
			{
				Name: '@HOURShift_in',
				DbType: 'int',
				Value: isMoscowTimeZone ? 2 : 0,
				Direction: 'Input',
			},
			{
				Name: '@CanDiagUse',
				DbType: 'String',
				Value: canDiagUse,
				Direction: 'Input',
			},
		],
	};
}
export function getVolumeOfMergedCondensate(params: ChannelsChartDataParams) {
	const {
		startDateTime,
		endDateTime,
		discrete = 'C',
		channelNumber = 0,
	} = params;
	return {
		Sql: '[Energy].[energy].Get_АРМ_ОбъёмСлитогоКонденсата_PROXY',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@from_dat',
				DbType: 'String',
				Value: format(startDateTime, 'yyyy.MM.dd HH:mm:ss'),
				Direction: 'Input',
			},
			{
				Name: '@to_dat',
				DbType: 'String',
				Value: format(endDateTime, 'yyyy.MM.dd HH:mm:ss'),
				Direction: 'Input',
			},
			{
				Name: '@typ',
				DbType: 'String',
				Value: discrete,
				Direction: 'Input',
			},
			{
				Name: '@num_can',
				DbType: 'int',
				Value: channelNumber,
				Direction: 'Input',
			},
		],
	};
}
