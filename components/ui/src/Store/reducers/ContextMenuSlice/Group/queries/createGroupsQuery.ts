import { getOutputParameters } from '../../../../../Const/utils';

import { CreateGroupsQuery } from './types';

export function createGroupsQuery({
	name,
	number,
	unit,
	method,
	typeStorage,
	server,
	count = 1,
	numberEwork = null,
	userId,
	moduleName,
}: CreateGroupsQuery) {
	return {
		Sql: '[appl_tags].[Ins_CreateNewGroups]',
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
				Name: '@FK_Units',
				DbType: 'int',
				Value: unit,
				Direction: 'Input',
			},
			{
				Name: '@FK_Methods',
				DbType: 'int',
				Value: method,
				Direction: 'Input',
			},
			{
				Name: '@FK_TypesStorage',
				DbType: 'int',
				Value: typeStorage,
				Direction: 'Input',
			},
			{
				Name: '@FK_DataServers',
				DbType: 'int',
				Value: server,
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
				Name: '@Number_EWork',
				DbType: 'int',
				Value: numberEwork,
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
