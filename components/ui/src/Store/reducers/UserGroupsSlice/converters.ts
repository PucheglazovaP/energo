import { UserGroup, UserGroupResponse } from './types';

/**
 *
 * @param userGroups response user groups
 * @returns converted user groups to use in app
 */
export function convertUserGroups(
	userGroups: UserGroupResponse[],
): UserGroup[] {
	const convertedUserGroups: UserGroup[] = userGroups.map((group) => ({
		start: group.ID_Group_Start,
		end: group.ID_Group_End,
	}));
	return convertedUserGroups;
}
