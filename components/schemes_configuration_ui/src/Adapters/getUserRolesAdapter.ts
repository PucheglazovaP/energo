import {
	BackendResponse,
	Role,
	RoleKey,
	UserRoleResponse,
} from '../Shared/types';

export function getUserRolesAdapter(response: string): Role[] {
	const { Response }: BackendResponse = JSON.parse(response);
	const data = Response.Tables[0].Rows as UserRoleResponse[];

	const userRoles: Role[] = data.map(
		(userRole) => Role[userRole.ROLE_NAME as RoleKey],
	);

	return userRoles;
}
