import { capitalizeFirstLetter } from './capitalizeFirstLetter';

export function convertUserToPeopleName(preferredUsername: string): string {
	const [surname, initials] = preferredUsername.split('_');
	const upperInitials = initials.toUpperCase();
	const firstNameChar: string = String(
		(upperInitials[0] && upperInitials[0].concat('.')) || '',
	);
	const secondNameChar: string = String(
		(upperInitials[upperInitials.length - 1] &&
			upperInitials[upperInitials.length - 1].concat('.')) ||
			'',
	);
	return (
		capitalizeFirstLetter(surname).concat(' ') + firstNameChar + secondNameChar
	);
}
