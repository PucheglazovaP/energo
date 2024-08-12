import { toast } from 'react-toastify';
import { IMessage } from '@stomp/stompjs';

import { OutputParameters } from '../Shared/types';

import { RpcError } from './requests';

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
export function handleResponseOutputError(errors: OutputParameters[]) {
	for (const error of errors) {
		showResponseOutputError(error);
	}
}

/**
 * Default handler for failed effects
 * @param error any error type that extended from Error
 */
export function handleError(error: Error) {
	if (error instanceof RpcError) {
		if (Array.isArray(error.details.errorName)) {
			handleResponseOutputError(error.details.errorName);
		} else {
			toast.error(error.details.errorName);
		}
	} else toast.error(error.message);
}
