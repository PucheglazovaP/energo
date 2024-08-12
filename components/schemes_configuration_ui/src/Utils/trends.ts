import { Trend } from '../Shared/types';

/**
 * Filter trends by valid date and value
 */
export function filterTrends(trends: Trend[]) {
	const result: Trend[] = trends.filter(
		(trend) =>
			trend.visible && new Date(trend.data[0]?.date).getFullYear() !== 1970,
	);
	return result;
}
export function getYAxisRangeConfig(
	trends: Trend[],
	isRelativeZeroEnabled: boolean,
) {
	if (!isRelativeZeroEnabled)
		return {
			min: undefined,
			max: undefined,
			startOnTick: undefined,
			endOnTick: undefined,
		};
	const { yAxisMin: min, yAxisMax: max } = calculateYAxisRange(trends);
	return {
		min,
		max,
		startOnTick: false,
		endOnTick: false,
	};
}

export function calculateYAxisRange(trends: Trend[]) {
	let min = Infinity;
	let max = -Infinity;

	trends.forEach((trend) => {
		const data = trend.data;
		for (let i = 0; i < data.length; i++) {
			const val = data[i].value;
			if (val) {
				if (val < min) {
					min = val;
				}
				if (val > max) {
					max = val;
				}
			}
		}
	});
	if (min === Infinity) min = 0;
	if (max === -Infinity) max = 0;
	const absMax = Math.max(Math.abs(min), Math.abs(max));
	const yAxisMin = min < 0 ? min - 1 : 0;
	const yAxisMax = absMax * 1.1;

	return { yAxisMin, yAxisMax };
}
