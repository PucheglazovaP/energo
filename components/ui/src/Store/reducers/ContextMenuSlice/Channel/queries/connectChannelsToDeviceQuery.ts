import { getOutputParameters } from '../../../../../Const/utils';

import { ConnectChannelsToDevice } from './types';

export function connectChannelsToDeviceQuery({
	deviceNumber,
	channelsNumbers,
	userId,
	moduleName,
}: ConnectChannelsToDevice) {
	return {
		Sql: '[appl_tags].[ConnectChannelsToDevice]',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@Number',
				DbType: 'int',
				Value: deviceNumber,
				Direction: 'Input',
				Size: '64',
			},
			{
				Name: '@ChanNumbers',
				DbType: 'String',
				Value: channelsNumbers,
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
				Size: 2000,
			},
			...getOutputParameters('textErr'),
		],
	};
}
