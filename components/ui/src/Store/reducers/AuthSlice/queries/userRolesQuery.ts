import { UserQuery } from './types';

export function userRolesQuery({ userId }: UserQuery) {
	return {
		Sql: '[dlm].[GetAccountRoles]',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@ID_User',
				DbType: 'String',
				Value: userId,
				Direction: 'Input',
			},
		],
	};
}
