import { getOutputParameters } from '../../../../../Const/utils';

import { DisconnectChannels } from './types';

export function disconnectChannelsQuery({
	channelNumbers,
	userId,
	moduleName,
}: DisconnectChannels) {
	return {
		Sql: '[appl_tags].[DisconnectChannelsFromDevice]',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@ChanNumbers',
				DbType: 'String',
				Value: channelNumbers,
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
				Name: '@LastModified',
				DbType: 'String',
				Value: null,
				Direction: 'Output',
				Size: '2000',
			},
			...getOutputParameters('textErr'),
		],
	};
}
