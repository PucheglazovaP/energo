import { getOutputParameters } from '../../../../../Const/utils';

import { IncludeChannelsToGroup } from './types';

export function includeChannelsToGroupQuery({
	groupNumber,
	channels,
	coefficient,
	userId,
	moduleName,
}: IncludeChannelsToGroup) {
	return {
		Sql: '[appl_tags].[Ins_Relation_ChannelsGroup]',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@FK_Group',
				DbType: 'int',
				Value: groupNumber,
				Direction: 'Input',
			},
			{
				Name: '@Channels',
				DbType: 'String',
				Value: channels,
				Direction: 'Input',
			},
			{
				Name: '@Koef',
				DbType: 'int',
				Value: coefficient,
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
			...getOutputParameters('textErr'),
		],
	};
}
