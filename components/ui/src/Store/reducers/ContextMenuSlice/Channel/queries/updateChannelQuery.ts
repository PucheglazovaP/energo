import { getOutputParameters } from '../../../../../Const/utils';

import { UpdateChannel } from './types';

export function updateChannelQuery({
	channelNumber,
	channelName,
	fkDevices,
	fkUnits,
	fkTypeStorage,
	fkMethods,
	lastModified,
	userId,
	moduleName,
}: UpdateChannel) {
	return {
		Sql: '[appl_tags].[Upd_Channel]',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@Number',
				DbType: 'int',
				Value: channelNumber,
				Direction: 'Input',
			},
			{
				Name: '@Name',
				DbType: 'String',
				Value: channelName,
				Direction: 'Input',
			},
			{
				Name: '@FK_Devices',
				DbType: 'int',
				Value: fkDevices,
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
			{
				Name: '@LastModified',
				DbType: 'Guid',
				Value: lastModified,
				Direction: 'Input',
			},
			...getOutputParameters('textWarn', 'textErr'),
		],
	};
}
