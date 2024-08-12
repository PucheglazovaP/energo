export function toggleArrayValue<T>(array: Array<T>, value: T): Array<T> {
	const index = array.indexOf(value);

	if (index === -1) {
		array.push(value);
	} else {
		array.splice(index, 1);
	}

	return array;
}
