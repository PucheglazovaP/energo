// import { format } from 'date-fns';

import clsx from 'clsx';
import {
	AlignValue,
	AxisTitleAlignValue,
	DashStyleValue,
	PointOptionsObject,
	SeriesOptionsType,
	SeriesZonesOptionsObject,
	XrangePointOptionsObject,
	YAxisPlotLinesOptions,
} from 'highcharts';

import { OptionWithCoefficient } from '../../Models/ActiveChart/types';
import { YAXIS_LINE_COLORS } from '../../Shared/const';
import {
	ChartKoefListResponse,
	ChartKoefResponse,
	Trend,
} from '../../Shared/types';
import { calculateY } from '../../Utils/convertValue';
import { generateRandomColor } from '../../Utils/generateRandomColor';
import { filterTrends, getYAxisRangeConfig } from '../../Utils/trends';

type GetColor = {
	color: string | undefined;
	index: number;
};

/**
 * Get color of the trend or generate new one
 */
function getColor({ color, index }: GetColor) {
	const result = color
		? color
		: index <= 10
		? YAXIS_LINE_COLORS[index]
		: generateRandomColor(['#EB5835', ...YAXIS_LINE_COLORS]);
	return result;
}

export default function chartDataAdapter(
	trends: Trend[],
	isMultiYaxesEnabled: boolean,
	selectedUnit: OptionWithCoefficient,
): SeriesOptionsType[] {
	const series = filterTrends(trends).map((trend, index) => {
		const trendColor = getColor({ color: trend.color, index });
		const data: PointOptionsObject[] = trend.data.map((item) => {
			return {
				y: calculateY(item.value, selectedUnit.coefficient, trend.round),
				x: new Date(item.date).getTime(),
				color: item.value != null ? trendColor : 'red',
				dashStyle: item.value != null ? 'solid' : ('dot' as DashStyleValue),
			};
		}) as XrangePointOptionsObject[];

		let currentColor = '';
		let currentDashStyle: DashStyleValue | undefined = 'Solid';
		const zones = data.reduce<SeriesZonesOptionsObject[]>(
			(prev, curr, index) => {
				if (index === 0) {
					currentColor = curr.color as string;
					currentDashStyle = curr.dashStyle;
				} else if (currentColor !== curr.color) {
					prev.push({
						value: curr.x as number,
						color: currentColor,
						dashStyle: currentDashStyle,
					});
					currentColor = curr.color as string;
					currentDashStyle = curr.dashStyle;
				}
				if (index === data.length - 1)
					prev.push({
						value: (curr.x as number) + 1,
						color: curr.color as string,
						dashStyle: curr.dashStyle,
					});
				return prev;
			},
			[],
		);
		return {
			id: trend.id,
			name: clsx(trend.name, selectedUnit.label),
			data,
			zoneAxis: 'x',
			zones: zones,
			connectNulls: true,
			maxPointWidth: 63,
			dataLabels: {
				enabled: false,
			},
			type: 'line',
			turboThreshold: 0,
			visible: trend.isVisibleOnChart,
			step: 'center',
			yAxis: isMultiYaxesEnabled ? index : undefined,
			color: trendColor,
			lineWidth: trend.width ?? 1,
		};
	});
	return series as SeriesOptionsType[];
}
export function currChartKoefAdapter(result: string) {
	const data: ChartKoefResponse[] = JSON.parse(result).Response.Tables[0].Rows;
	if (Array.isArray(data) && data.length > 0)
		return {
			unitId: data[0].Unit_ID,
			unitName: data[0].Unit_Name,
			methodName: data[0].Method_Name,
			isConsumption: Boolean(data[0].IsConsumption),
		};
	return { unitId: null, unitName: '', methodName: '', isConsumption: false };
}
export function unitListAdapter(result: string) {
	const data: ChartKoefListResponse =
		JSON.parse(result).Response.Tables[0].Rows;
	if (Array.isArray(data) && data.length > 0)
		return data.map((item) => ({
			value: String(item.ID),
			label: item.Name,
			coefficient: item.Coefficient,
			isSelected: false,
		}));
	return [];
}

export function createYaxes(
	chartData: Trend[],
	isRelativeZeroEnabled: boolean,
	activePlotLines?: YAxisPlotLinesOptions[],
) {
	const yAxisRangeConfig = getYAxisRangeConfig(
		chartData,
		isRelativeZeroEnabled,
	);
	return chartData.map((item, index) => ({
		allowDecimals: true,
		opposite: index !== 0,
		lineColor:
			index <= 10
				? YAXIS_LINE_COLORS[index]
				: generateRandomColor(['#EB5835', ...YAXIS_LINE_COLORS]),
		title: {
			text: item.unitName,
			align: 'high' as AxisTitleAlignValue,
			y: -10,
			x: 0,
			rotation: 0,
			offset: 0,
			textAlign: 'middle' as AlignValue,
			style: {
				fontWeight: '500',
				color: '#000000',
			},
		},
		labels: {
			align: 'left' as AlignValue,
			x: 5,
		},
		lineWidth: 3,
		offset: index === 0 ? 30 : undefined,
		margin: 10,
		...yAxisRangeConfig,
		plotLines: index === 0 ? activePlotLines : undefined,
	}));
}
