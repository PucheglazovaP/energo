import { getOutputParameters } from '../../../../../Const/utils';

import { RemoveChannelsFromGroupQuery } from './types';

export function removeChannelFromGroupQuery({
	groupNumber,
	channelNumber,
	userId,
	moduleName,
}: RemoveChannelsFromGroupQuery) {
	return {
		Sql: '[appl_tags].[Del_ChannelsInGroups]',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@FK_Group',
				DbType: 'int',
				Value: groupNumber,
				Direction: 'Input',
			},
			{
				Name: '@FK_Channel',
				DbType: 'int',
				Value: channelNumber,
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
			...getOutputParameters('textErr', 'logOperation'),
		],
	};
}
