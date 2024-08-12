import { SeriesOptionsType, XrangePointOptionsObject } from 'highcharts';

import { OptionWithCoefficient } from '../../Models/ActiveChart/types';
import { ChartValue } from '../../Shared/types';

export default function columnChartDataAdapter(
	data: ChartValue[],
	selectedUnit: OptionWithCoefficient,
	title: string,
	round: number,
): SeriesOptionsType[] {
	const series = [
		{
			name: title,
			data: data.map((point) => ({
				y:
					point.value != null
						? Number((point.value * selectedUnit.coefficient).toFixed(round))
						: null,
				x: new Date(point.date).getTime(),
			})) as XrangePointOptionsObject[],
			maxPointWidth: 63,
			type: 'column' as 'xrange',
			turboThreshold: 0,
			visible: true,
			step: true,
			color: '#B7D2B3',
			pointWidth: 10,
			dataLabels: {
				enabled: false,
			},
			isNull: true,
			borderWidth: 0,
			minPadding: 10,
		},
	];
	return series;
}
