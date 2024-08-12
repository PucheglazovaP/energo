/**
 * Calculate percentage of value based on total;
 * Round float value (if it is) to the nearest integer.
 * @param value - value that will be multiplied by 100 (to make it percentage)
 * @param total - total
 * @example
 * 	// returns 0
 * 	calculatePercentage(0, 0);
 * @example
 * 	// return 0.05
 * 	calculatePercentage(5, 100);
 * @returns calculated value in percentage
 */
export function calculatePercentage(value: number, total: number): number {
	const result: number = Math.round((value / total) * 100);
	if (Number.isNaN(result)) {
		return 0;
	}
	return result;
}
