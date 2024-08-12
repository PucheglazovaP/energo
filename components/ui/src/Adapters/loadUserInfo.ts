import { User, UserResponse } from '../Shared/types';

export function convertOriginUserInfoToUser(origin: UserResponse): User {
	return {
		id: origin.sub,
		lastName: origin.family_name,
		firstName: origin.given_name,
		secondName: '',
		email: origin.email,
		groups: origin.groups,
		preferredUsername: origin.preferred_username.split('\\')[1],
		roles: origin.roles,
	};
}
