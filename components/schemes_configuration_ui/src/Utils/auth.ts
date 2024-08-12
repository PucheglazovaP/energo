import { NEED_TO_SKIP_AUTH } from '../Shared/const';

export function getCurrentOrigin() {
	return window.location.origin;
}
export function checkLocalhost() {
	return getCurrentOrigin().includes('localhost');
}

export function checkSkipAuth() {
	return NEED_TO_SKIP_AUTH && checkLocalhost();
}
