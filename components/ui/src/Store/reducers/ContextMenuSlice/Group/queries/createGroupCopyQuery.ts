import { getOutputParameters } from '../../../../../Const/utils';

import { CreateGroupCopyQuery } from './types';

export function createGroupCopyQuery({
	name,
	numberSource,
	numberNew,
	userId,
	moduleName,
}: CreateGroupCopyQuery) {
	return {
		Sql: '[appl_tags].[Ins_CopyGroup]',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@NumberSource',
				DbType: 'int',
				Value: numberSource,
				Direction: 'Input',
			},
			{
				Name: '@NumberNew',
				DbType: 'int',
				Value: numberNew,
				Direction: 'Input',
			},
			{
				Name: '@Name',
				DbType: 'String',
				Value: name,
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
			...getOutputParameters('textErr', 'logOperation', 'err'),
		],
	};
}
