import { getOutputParameters } from '../../../Const/utils';
import { User } from '../../../Types/UserTypes';

export function userGroupsQuery({ userId }: User) {
	return {
		Sql: '[appl_tags].[Get_AccountsGroups]',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@AccUID',
				DbType: 'String',
				Value: userId,
				Direction: 'Input',
			},
			{
				Name: '@OrderMode',
				DbType: 'int',
				Value: 1,
				Direction: 'Input',
			},
			{
				Name: '@ID_User',
				DbType: 'String',
				Value: userId,
				Direction: 'Input',
			},
			...getOutputParameters('textErr'),
		],
	};
}
