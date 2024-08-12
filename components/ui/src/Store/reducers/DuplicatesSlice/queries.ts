import { DuplicatesQuery } from './types';

export function duplicatesQuery({ Value }: DuplicatesQuery) {
	return {
		Sql: '[appl_tags].[Get_GroupsEquival]',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@Number',
				DbType: 'int',
				Value: Value,
				Direction: 'Input',
			},
		],
	};
}
