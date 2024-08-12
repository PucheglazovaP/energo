import { AlignValue, AxisTitleAlignValue } from 'highcharts';

import { YAXIS_LINE_COLORS } from '../../Shared/const';
import { Trend } from '../../Shared/types';
import { ITableColumn } from '../../UI/Table/types';
import { generateRandomColor } from '../../Utils/generateRandomColor';
import { getYAxisRangeConfig } from '../../Utils/trends';

export function modifyHeaders(tableHeader: ITableColumn[], trends: Trend[]) {
	const newColumns: ITableColumn[] = trends.map((trend, index) => ({
		accessor: `col${index}`,
		text: trend.name,
		isResizable: false,
		isSortable: false,
		sortOrder: 0,
		type: 'number',
		minWidth: 300,
		width: 300,
		isVisible: true,
	}));
	newColumns.push({
		accessor: `sum`,
		text: 'Сумма',
		isResizable: false,
		isSortable: false,
		sortOrder: 0,
		type: 'string',
		minWidth: 300,
		width: 300,
		isVisible: false,
	});
	return [...tableHeader, ...newColumns];
}

export function createYaxes(
	chartData: Trend[],
	isSumColumnVisible: boolean,
	isRelativeZeroEnabled: boolean,
) {
	const yAxisRangeConfig = getYAxisRangeConfig(
		chartData,
		isRelativeZeroEnabled,
	);
	const yAxes = chartData.map((item, index) => ({
		allowDecimals: true,
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
		opposite: index !== 0,
		lineWidth: 3,
		offset: index === 0 ? 30 : undefined,
		margin: 10,
		lineColor:
			index <= 10
				? YAXIS_LINE_COLORS[index]
				: generateRandomColor(['#EB5835', ...YAXIS_LINE_COLORS]),
		...yAxisRangeConfig,
	}));
	if (isSumColumnVisible) {
		yAxes.push({
			allowDecimals: true,
			title: {
				text: 'Сумма',
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
			opposite: true,
			lineWidth: 3,
			offset: undefined,
			margin: 10,
			lineColor: '#eb5835',
			...yAxisRangeConfig,
		});
	}
	return yAxes;
}
