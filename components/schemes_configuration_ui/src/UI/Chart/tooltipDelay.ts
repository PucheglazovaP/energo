import type { Point, Tooltip } from 'highcharts';

declare module 'highcharts' {
	interface TooltipOptions {
		delayForDisplay?: number;
	}
}

const timerIdMap = new Map<string, number>();
const generatePointsUniqueKey = (points: Point[]) => {
	const generatePointKey = (point: Point): string => {
		return (
			point.category + ' ' + point.series.name + ': ' + point.x + ' ' + point.y
		);
	};

	const result = points.map(generatePointKey).join(', ');

	return result;
};
export const refreshWrapper = function (
	this: Tooltip,
	proceed: (context: any, args: any[]) => void,
	pointOrPoints: Point | Point[],
	args: any[],
) {
	const tooltip = this;

	let seriesName: string | undefined = undefined;
	if (Array.isArray(pointOrPoints)) {
		seriesName = generatePointsUniqueKey(pointOrPoints);
	} else {
		seriesName = pointOrPoints.series.name;
	}

	const chart = tooltip.chart;

	const delayForDisplay: number =
		typeof chart?.options?.tooltip?.delayForDisplay === 'number'
			? chart.options.tooltip.delayForDisplay
			: 1000;

	if (timerIdMap.has(seriesName)) {
		clearTimeout(timerIdMap.get(seriesName));
		timerIdMap.delete(seriesName);
	}

	const timerId = window.setTimeout(() => {
		if (Array.isArray(pointOrPoints)) {
			const pointIndex = pointOrPoints.findIndex((point) => {
				return point.category === chart.hoverPoint?.category;
			});
			if (pointIndex >= 0) {
				proceed.apply(tooltip, [pointOrPoints, args]);
			}
		} else if (pointOrPoints === chart.hoverPoint)
			proceed.apply(tooltip, [pointOrPoints, args]);
	}, delayForDisplay);

	timerIdMap.set(seriesName, timerId);
};
