import { User, UserResponse } from '../Shared/types';

export function convertOriginUserInfoToUser(origin: UserResponse): User {
	return {
		id: origin.sub,
		lastName: origin.family_name,
		firstName: origin.given_name,
		email: origin.email,
		preferredUsername: origin.preferred_username.split('\\')[1],
	};
}
