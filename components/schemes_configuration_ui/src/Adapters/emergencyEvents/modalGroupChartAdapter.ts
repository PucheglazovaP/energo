import { format } from 'date-fns';
import { PointOptionsObject, SeriesOptionsType } from 'highcharts';

import { ChartValue } from '../../Shared/types';
import { calculateY } from '../../Utils/convertValue';
import { DateFormat } from '../../Utils/dateUtils';

export default function groupInfoChartDataAdapter(
	trendData: ChartValue[],
	maxSetpoint: number | null,
	minSetpoint: number | null,
): SeriesOptionsType[] {
	const data: PointOptionsObject[] = [];
	const maxSetpointData: PointOptionsObject[] = [];
	const minSetpointData: PointOptionsObject[] = [];
	trendData.forEach((item) => {
		data.push({
			y: calculateY(item.value, 1, 2),
			x: new Date(item.date).getTime(),
		});
		maxSetpointData.push({
			y: maxSetpoint,
			x: new Date(item.date).getTime(),
		});
		minSetpointData.push({
			y: minSetpoint,
			x: new Date(item.date).getTime(),
		});
	});
	const series = [
		{
			name: 'Фактическое значение',
			maxPointWidth: 63,
			dataLabels: {
				enabled: false,
			},
			data,
			type: 'line',
			turboThreshold: 0,
			visible: true,
			lineWidth: 3,
			color: '#9B9B9C',
		},
		{
			name: 'Максимальная уставка',
			maxPointWidth: 63,
			dataLabels: {
				enabled: false,
			},
			data: maxSetpointData,
			type: 'line',
			turboThreshold: 0,
			visible: true,
			lineWidth: 3,
			color: '#D47CA2',
		},
		{
			name: 'Минимальная уставка',
			maxPointWidth: 63,
			dataLabels: {
				enabled: false,
			},
			data: minSetpointData,
			type: 'line',
			turboThreshold: 0,
			visible: true,
			lineWidth: 3,
			color: '#B7D2B3',
		},
	];
	return series as SeriesOptionsType[];
}
export function tableDataAdapter(trendData: ChartValue[]) {
	if (trendData.length > 0) {
		const tableData = trendData.map((item) => {
			const formattedDate = format(
				new Date(item.date),
				DateFormat.DefaultDisplayFormatWithSeconds,
			);
			return {
				dataLine: [
					{ accessor: 'date', text: formattedDate },
					{
						accessor: 'unit',
						text: item.value != null ? Number(item.value).toFixed(2) : 'Н/Д',
					},
				],
				rowClassName: 'chart_table_row',
			};
		});

		return tableData;
	}
	return [];
}
