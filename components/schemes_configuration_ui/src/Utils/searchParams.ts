/**
 * Add new parameters to url search params from provided object
 * P.S.: if value is undefined - this value will be deleted from search params
 */
export function updateSearchParams(
	searchParams: URLSearchParams,
	obj: { [key: string]: string | number | undefined },
): URLSearchParams {
	const newSearchParams: URLSearchParams = new URLSearchParams(searchParams);
	newSearchParams.delete('baseHour');
	for (const [key, value] of Object.entries(obj)) {
		if (value === undefined) {
			newSearchParams.delete(key);
		} else {
			newSearchParams.set(key, String(value));
		}
	}
	return newSearchParams;
}
