export function isAllElementsEqual(arr: any[]) {
	if (arr.length === 0) {
		return true; // Если массив пустой, считаем, что все элементы равны
	}
	const firstElement = arr[0];
	for (let i = 1; i < arr.length; i++) {
		if (arr[i] !== firstElement) {
			return false;
		}
	}
	return true;
}
