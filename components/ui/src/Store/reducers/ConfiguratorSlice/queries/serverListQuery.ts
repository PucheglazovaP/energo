import { ServerListQuery } from './types';

export function serversListQuery({ userId }: ServerListQuery) {
	return {
		Sql: '[appl_tags].[Get_ListDataServers]',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@ID_User',
				DbType: 'String',
				Value: userId,
				Direction: 'Input',
			},
		],
	};
}
