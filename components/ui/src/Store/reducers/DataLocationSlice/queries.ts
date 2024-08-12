import { ChannelsLocationQuery } from './types';

export function channelsLocationQuery({
	channelNumber,
	userId,
	moduleName,
	error,
	textError,
}: ChannelsLocationQuery) {
	return {
		Sql: '[appl_tags].[GET_LocationChannel]',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@Number',
				DbType: 'int',
				Value: channelNumber,
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
				Value: error,
				Direction: 'Output',
				Size: '64',
			},
			{
				Name: '@TextErr',
				DbType: 'String',
				Value: textError,
				Direction: 'Output',
				Size: '2000',
			},
		],
	};
}
