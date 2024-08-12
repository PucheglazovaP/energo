import { UserId } from '../../Shared/types';

export function getUserRolesQuery({ userId }: UserId) {
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
