export const useDebounce = <
	F extends (...args: Parameters<F>) => ReturnType<F>,
>(
	func: F,
	delay: number = 300,
) => {
	let timeout: ReturnType<typeof setTimeout>;

	const debounced = (...args: Parameters<F>) => {
		clearTimeout(timeout);
		timeout = setTimeout(() => func(...args), delay);
	};

	return debounced;
};

export default useDebounce;
