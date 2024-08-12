import { getOutputParameters } from '../../../../../Const/utils';

import { UpdateChannelsCoefficients } from './types';

export function updateChannelsCoefficientsQuery({
	groupNumber,
	channelsNumbers,
	coefficient,
	userId,
	moduleName,
}: UpdateChannelsCoefficients) {
	return {
		Sql: '[appl_tags].[Upd_Relation_ChannelsGroup]',
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
				Value: channelsNumbers,
				Direction: 'Input',
			},
			{
				Name: '@Koef',
				DbType: 'float',
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
			...getOutputParameters('logOperation', 'textErr'),
		],
	};
}
