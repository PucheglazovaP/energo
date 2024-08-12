import { getOutputParameters } from '../../../../../Const/utils';

import { CreateDevicesQuery } from './types';

export function createDevicesQuery({
	name,
	number,
	comment,
	server,
	count = 1,
	userId,
	moduleName,
}: CreateDevicesQuery) {
	return {
		Sql: '[appl_tags].[Ins_CreateNewDevices]',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@Number',
				DbType: 'int',
				Value: number,
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
				Value: name,
				Direction: 'Input',
			},
			{
				Name: '@FK_DataServers',
				DbType: 'int',
				Value: server,
				Direction: 'Input',
			},
			{
				Name: '@Comment',
				DbType: 'String',
				Value: comment,
				Direction: 'Input',
			},
			{
				Name: '@ID_User',
				DbType: 'String',
				Value: userId,
				Direction: 'Input',
			},
			{
				Name: '@Type',
				DbType: 'int',
				Value: 0,
				Direction: 'Input',
			},
			{
				Name: '@NumberNet',
				DbType: 'int',
				Value: 0,
				Direction: 'Input',
			},
			{
				Name: '@Port',
				DbType: 'int',
				Value: 0,
				Direction: 'Input',
			},
			{
				Name: '@Line',
				DbType: 'int',
				Value: 0,
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
