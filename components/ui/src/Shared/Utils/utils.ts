import { toast } from 'react-toastify';
import { IMessage } from '@stomp/stompjs';

import { TOption, TOptionHeading } from '../../UI/Dropdown/types';
import { NEED_TO_SKIP_AUTH } from '../const';
import { OutputParameters, RouteApps } from '../types';

/**
 * Check if rpc response contains user-level errors
 */
export function checkResponseOutputErrors(response: IMessage): boolean {
	const errors: OutputParameters[] = JSON.parse(response.body).Response
		.OutParameters;
	if (errors.length) {
		const filteredErrors = errors.filter((error) => error['@TextErr'] !== '');
		return !!filteredErrors.length;
	}
	return false;
}
/**
 * Check if rpc response contains user-level warnings
 */
export function checkResponseOutputWarnings(response: IMessage): boolean {
	const warnings: OutputParameters[] = JSON.parse(response.body).Response
		.OutParameters;
	if (warnings.length) {
		const filteredWarnings = warnings.filter((warning) => warning['@TextWarn']);
		if (filteredWarnings.length) {
			for (const warn of filteredWarnings) {
				showResponseOutputWarning(warn);
			}
		}
	}
	return false;
}

/**
 * Show the user-level error in the toast
 */
export function showResponseOutputError(error: OutputParameters) {
	toast.error(error['@TextErr']);
}

/**
 * Show the user-level warning in the toast
 */
export function showResponseOutputWarning(warning: OutputParameters) {
	toast.warn(warning['@TextWarn']);
}

/**
 * Check the user-level errors in the response and show it in the toast
 */
export function handleResponseOutputError(response: IMessage) {
	const parsedResponse = JSON.parse(response.body);
	const errors: OutputParameters[] = parsedResponse.Response.OutParameters;
	if (checkResponseOutputErrors(response)) {
		for (const error of errors) {
			showResponseOutputError(error);
		}
	}
}
/**
 * Check the user-level warnings in the response and show it in the toast
 */
export function handleResponseOutputWarning(response: IMessage) {
	const parsedResponse = JSON.parse(response.body);
	const warnings: OutputParameters[] = parsedResponse.Response.OutParameters;
	if (checkResponseOutputWarnings(response)) {
		for (const warning of warnings) {
			showResponseOutputError(warning);
		}
	}
}

/**
 *
 * @param app name of the app
 * @returns base url of the app
 */
export function getBaseUrl(app: RouteApps) {
	if (app === RouteApps.MONITORING) {
		return import.meta.env.VITE_MONITORING_BASE_URL || window.location.origin;
	}
}

export function isHeadingOption(
	opt: TOption | TOptionHeading,
): opt is TOptionHeading {
	return Object.prototype.hasOwnProperty.call(opt, 'title');
}

export function convertUserToPeopleName(preferredUsername: string): string {
	const [surname, initials] = preferredUsername.split('_');
	const upperInitials = initials.toUpperCase();
	const firstNameChar: string = String(
		(upperInitials[0] && upperInitials[0].concat('.')) || '',
	);
	const secondNameChar: string = String(
		(upperInitials[1] && upperInitials[1].concat('.')) || '',
	);
	return (
		capitalizeFirstLetter(surname).concat(' ') + firstNameChar + secondNameChar
	);
}

export function createAPIHost() {
	return window.location.origin;
}

export function capitalizeFirstLetter(string: string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

export function checkLocalhost() {
	return createAPIHost().includes('localhost');
}
export function checkSkipAuth() {
	return NEED_TO_SKIP_AUTH && checkLocalhost();
}

export function getOpenFunction(url: string) {
	return () => {
		window.open(url);
	};
}
