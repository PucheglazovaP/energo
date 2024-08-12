import { getOutputParameters } from '../../../../../Const/utils';

import { CreateGroupsFromChannels } from './types';

export function createGroupsFromChannelsQuery({
	groupStartNumber,
	namePrefix,
	channelNumbers,
	userId,
	moduleName,
}: CreateGroupsFromChannels) {
	return {
		Sql: '[appl_tags].[Ins_CreateGroupsByChannels]',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@Number',
				DbType: 'int',
				Value: groupStartNumber,
				Direction: 'Input',
				Size: '64',
			},
			{
				Name: '@ChanNumbers',
				DbType: 'String',
				Value: channelNumbers,
				Direction: 'Input',
			},
			{
				Name: '@NamePref',
				DbType: 'String',
				Value: namePrefix,
				Direction: 'Input',
			},
			{
				Name: '@Formula',
				DbType: 'Boolean',
				Value: false,
				Direction: 'Input',
			},
			{
				Name: '@ActiveFormula',
				DbType: 'Boolean',
				Value: false,
				Direction: 'Input',
			},
			{
				Name: '@ID_User_Owner',
				DbType: 'String',
				Value: userId,
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
