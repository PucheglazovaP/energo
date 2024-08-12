import clsx from 'clsx';
import { format } from 'date-fns';
import { PointOptionsObject, SeriesOptionsType } from 'highcharts';

import { YAXIS_LINE_COLORS } from '../../Shared/const';
import { Trend } from '../../Shared/types';
import { DateFormat } from '../../Utils/dateUtils';
import { generateRandomColor } from '../../Utils/generateRandomColor';
import { getAggregateSum } from '../../Utils/getAggregateInfo';

export default function dynamicChartDataAdapter(
	trends: Trend[],
	isMultiYaxesEnabled: boolean,
	isSumColumnVisible: boolean,
): SeriesOptionsType[] {
	if (Array.isArray(trends)) {
		const sumData = trends.reduce<PointOptionsObject[]>((acc, trend) => {
			const trendData = trend.data;
			for (let i = 0; i < trendData.length; i++) {
				const value = trendData[i].value
					? Number(trendData[i].value?.toFixed(trend.round))
					: 0;
				if (acc[i]) {
					acc[i] = {
						...acc[i],
						y: parseFloat(((acc[i]?.y || 0) + value).toFixed(trend.round)),
					};
				} else
					acc.push({
						y: value,
						x: new Date(trendData[i].date).getTime(),
					});
			}
			return acc;
		}, []);

		const series = trends.map((trend, index) => {
			const data: PointOptionsObject[] = [];
			const trendData = trend.data;
			for (let i = 0; i < trendData.length; i++) {
				data.push({
					y:
						trendData[i].value != null
							? Number(trendData[i].value?.toFixed(trend.round))
							: null,
					x: new Date(trendData[i].date).getTime(),
				});
			}
			return {
				name: clsx(trend.name, trend.unitName),
				data,
				maxPointWidth: 63,
				dataLabels: {
					enabled: false,
				},
				turboThreshold: 0,
				type: 'line' as 'windbarb',
				visible: true,
				step: true,
				yAxis: isMultiYaxesEnabled ? index : undefined,
				color:
					index <= 10
						? YAXIS_LINE_COLORS[index]
						: generateRandomColor(['#EB5835', ...YAXIS_LINE_COLORS]),
				dashStyle: 'Solid',
			};
		});
		series.push({
			name: 'Сумма',
			data: sumData,
			maxPointWidth: 63,
			dataLabels: {
				enabled: false,
			},
			turboThreshold: 0,
			type: 'line' as 'windbarb',
			step: true,
			color: '#eb5835',
			yAxis:
				isMultiYaxesEnabled && isSumColumnVisible ? series.length : undefined,
			visible: isSumColumnVisible,
			dashStyle: 'Dash',
		});
		return series;
	}
	return [];
}
export function tableDataAdapter(trends: Trend[]) {
	const tableData: Map<string, Record<string, number | string>> = new Map();
	const aggregateSumData: string[] = [];
	trends.forEach((trend, index) => {
		const trendData = trend.data;
		const aggregateSum = getAggregateSum(
			trend.methodName || 'Сумма',
			trendData,
			trend.isConsumption || false,
		);
		aggregateSumData.push(aggregateSum.toFixed(trend.round));
		for (let i = 0; i < trendData.length; i++) {
			const tableRow = tableData.get(trendData[i].date);

			if (tableRow) {
				tableData.set(trendData[i].date, {
					...tableRow,
					[`col${index}`]:
						trendData[i].value != null ? Number(trendData[i].value) : 'Н/Д',
				});
			} else
				tableData.set(trendData[i].date, {
					[`col${index}`]:
						trendData[i].value != null ? Number(trendData[i].value) : 'Н/Д',
				});
		}
	});
	const sortedArray = Array.from(tableData).sort((a, b) => {
		const date1 = new Date(a[0]).getTime();
		const date2 = new Date(b[0]).getTime();
		return date1 - date2;
	});

	const sortedMap = new Map(sortedArray);
	const result: Record<string, number | string>[] = Array.from(
		sortedMap.entries(),
	).map(([date, parameters]) => {
		const formattedDate = format(
			new Date(date),
			DateFormat.DefaultDisplayFormatWithSeconds,
		);
		const values = Object.values(parameters);
		return {
			date: formattedDate,
			...parameters,
			sum: values.reduce((acc, value) => Number(acc) + Number(value), 0),
		};
	});
	return { result, aggregateSumData };
}
