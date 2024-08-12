import { getOutputParameters } from '../../../../../Const/utils';

import { UpdateDevice } from './types';

export function updateDeviceQuery({
	number,
	name,
	comment,
	lastModified,
	userId,
	moduleName,
}: UpdateDevice) {
	return {
		Sql: '[appl_tags].[Upd_Device]',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@Number',
				DbType: 'int',
				Value: number,
				Direction: 'Input',
				Size: '64',
			},
			{
				Name: '@Name',
				DbType: 'String',
				Value: name,
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
				Size: '64',
			},
			...getOutputParameters('textErr', 'logOperation'),
		],
	};
}
