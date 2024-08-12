import { getOutputParameters } from '../../../../../Const/utils';

import { CreateNewChannels } from './types';

export function createNewChannelsQuery({
	channelNumber,
	count,
	channelName,
	deviceNumber,
	fkUnits,
	fkTypeStorage,
	fkMethods,
	serverId,
	userId,
	moduleName,
}: CreateNewChannels) {
	return {
		Sql: '[appl_tags].[Ins_CreateNewChannels]',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@Number',
				DbType: 'int',
				Value: channelNumber,
				Direction: 'Input',
			},
			{
				Name: '@Count',
				DbType: 'int',
				Value: count,
				Direction: 'Input',
			},
			{
				Name: '@NamePref',
				DbType: 'String',
				Value: channelName,
				Direction: 'Input',
			},
			{
				Name: '@FK_Devices',
				DbType: 'int',
				Value: deviceNumber,
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
				Name: '@FK_DataServers',
				DbType: 'int',
				Value: serverId,
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
