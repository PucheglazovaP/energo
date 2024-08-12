import { getOutputParameters } from '../../../../../Const/utils';

import { UpdateChannels } from './types';

export function updateChannelsQuery({
	channelsString,
	fkUnits,
	fkTypeStorage,
	fkMethods,
	userId,
	moduleName,
}: UpdateChannels) {
	return {
		Sql: '[appl_tags].[Upd_MultipleChannels]',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@Channels',
				DbType: 'String',
				Value: channelsString,
				Direction: 'Input',
			},
			{
				Name: '@ParamList',
				DbType: 'String',
				Value: 'FK_Units,FK_Methods,FK_TypeStorage',
				Direction: 'Input',
			},
			{
				Name: '@FK_Units',
				DbType: 'int',
				Value: fkUnits,
				Direction: 'Input',
			},
			{
				Name: '@FK_Methods',
				DbType: 'int',
				Value: fkMethods,
				Direction: 'Input',
			},
			{
				Name: '@FK_TypeStorage',
				DbType: 'int',
				Value: fkTypeStorage,
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
			...getOutputParameters('textWarn', 'textErr'),
		],
	};
}
