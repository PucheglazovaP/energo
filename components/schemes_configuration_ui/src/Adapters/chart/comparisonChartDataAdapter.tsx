import format from 'date-fns/format';
import { PointOptionsObject, SeriesOptionsType } from 'highcharts';

import { ComparisonChartData } from '../../Containers/ChartComparison/types';
import { OptionWithCoefficient } from '../../Models/ActiveChart/types';
import { AggregateTypes, ColumnTable, ExcelRow } from '../../Shared/types';
import { DateFormat, getDatesForAggregateValues } from '../../Utils/dateUtils';

export default function chartDataAdapter(
	trends: ComparisonChartData[],
	selectedUnit: OptionWithCoefficient,
	round: number,
	isSumColumnVisible: boolean,
	methodName?: string,
): SeriesOptionsType[] {
	let categories: number[] = [];
	const maxPointCount = trends.reduce<number>((prev, item) => {
		const arrayLength = item.data.length;
		if (arrayLength > prev) return arrayLength;
		return prev;
	}, 0);
	categories = Array.from({ length: maxPointCount }, (v, i) => i);
	const series = trends.map((item) => {
		let data = [];
		if (trends.length > 1) {
			data = item.data.map((item, pointIndex) => ({
				y:
					item.value != null
						? Number((item.value * selectedUnit.coefficient).toFixed(round))
						: null,
				x: categories[pointIndex],
				x2: new Date(item.date).getTime(),
			})) as PointOptionsObject[];
		} else
			data = item.data.map((item) => ({
				y:
					item.value != null
						? Number((item.value * selectedUnit.coefficient).toFixed(round))
						: null,
				x: new Date(item.date).getTime(),
			})) as PointOptionsObject[];
		const [startDateTimeForRequest, endDateTimeForRequest] =
			getDatesForAggregateValues({
				startDateTime: item.startDateTime,
				endDateTime: item.endDateTime,
				methodName: methodName || AggregateTypes.Current,
			});
		return {
			id: item.id,
			name: `${format(
				startDateTimeForRequest,
				DateFormat.DefaultDisplayFormatWithSeconds,
			)} - ${format(
				endDateTimeForRequest,
				DateFormat.DefaultDisplayFormatWithSeconds,
			)} 00:00:00`,
			data,
			maxPointWidth: 63,
			dataLabels: {
				enabled: false,
			},
			type: 'line' as 'windbarb',
			turboThreshold: 0,
			visible: item.isVisibleOnChart,
			step: true,
			color: item.color,
			dashStyle: 'Solid',
		};
	});
	const sumData = trends.reduce<PointOptionsObject[]>((acc, trend) => {
		trend.data.forEach((dataItem, dataItemIndex) => {
			const value = dataItem.value
				? Number((dataItem.value * selectedUnit.coefficient).toFixed(round))
				: 0;
			if (acc[dataItemIndex]) {
				acc[dataItemIndex] = {
					...acc[dataItemIndex],
					y: parseFloat(((acc[dataItemIndex]?.y || 0) + value).toFixed(2)),
				};
			} else
				acc.push({
					y: value,
					x: categories[dataItemIndex],
				});
		});
		return acc;
	}, []);
	series.push({
		id: 'sum',
		name: 'Сумма',
		data: sumData,
		maxPointWidth: 63,
		dataLabels: {
			enabled: false,
		},
		type: 'line' as 'windbarb',
		turboThreshold: 0,
		step: true,
		color: '#eb5835',
		visible: isSumColumnVisible,
		dashStyle: 'Dash',
	});

	return series;
}

export function tableDataAdapter(
	trends: ComparisonChartData[],
	selectedUnit: OptionWithCoefficient,
	round: number,
) {
	const sumData = trends.reduce<{ x: number; y: number }[]>((acc, trend) => {
		trend.data.forEach((dataItem, dataItemIndex) => {
			const value =
				dataItem.value != null
					? Number((dataItem.value * selectedUnit.coefficient).toFixed(round))
					: 0;
			if (acc[dataItemIndex]) {
				acc[dataItemIndex] = {
					...acc[dataItemIndex],
					y: parseFloat(((acc[dataItemIndex]?.y || 0) + value).toFixed(2)),
				};
			} else
				acc.push({
					y: value,
					x: dataItemIndex,
				});
		});
		return acc;
	}, []);
	const data = trends.reduce<Record<string, number | string>[]>(
		(acc, trend, index) => {
			trend.data.forEach((dataItem, dataItemIndex) => {
				const formattedDate = format(
					new Date(dataItem.date),
					DateFormat.DefaultDisplayFormatWithSeconds,
				);
				const value =
					dataItem.value != null
						? Number((dataItem.value * selectedUnit.coefficient).toFixed(round))
						: 'Н/Д';
				let dataLine = {
					[`date${index}`]: formattedDate,
					[`col${index}`]: value,
				};

				let row = { ...dataLine };

				if (trends.length === 2 && trends[1].data[dataItemIndex]) {
					const delta = Math.abs(
						Number(dataItem.value) -
							Number(trends[1].data[dataItemIndex].value),
					).toFixed(round);
					row = {
						...row,
						delta,
					};
				}

				if (acc[dataItemIndex]) {
					acc[dataItemIndex] = {
						...acc[dataItemIndex],
						[`date${index}`]: formattedDate,
						[`col${index}`]: value,
						sum: sumData[dataItemIndex].y,
					};
				} else {
					acc.push({
						...row,
					});
				}
			});

			return acc;
		},
		[],
	);

	return data;
}
export function modifyHeaders(trends: ComparisonChartData[]) {
	const newColumns = trends.reduce<ColumnTable[]>((prev, trend, index) => {
		prev.push({
			accessor: `date${index}`,
			text: 'Дата и время',
			width: 300,
			isVisible: trend.isVisibleOnChart,
		});
		prev.push({
			accessor: `col${index}`,
			text: 'Показатель',
			width: 300,
			isVisible: trend.isVisibleOnChart,
		});
		return prev;
	}, []);
	newColumns.push({
		accessor: `sum`,
		text: 'Сумма',
		width: 300,
		isVisible: false,
	});

	if (trends.length === 2)
		return [
			{
				accessor: 'delta',
				text: 'Дельта',
				isResizable: false,
				isSortable: false,
				sortOrder: 0,
				type: 'string',
				width: 100,
				isVisible: true,
			},
			...newColumns,
		];

	return [...newColumns];
}
export function tableDataExcelAdapter(
	trends: ComparisonChartData[],
	coefficient: number,
) {
	const preparedData = trends.reduce<ExcelRow[]>((acc, trend, trendIndex) => {
		trend.data.forEach((dataItem, index) => {
			const formattedDate = format(
				new Date(dataItem.date),
				DateFormat.DefaultDisplayFormatWithSeconds,
			);
			const value =
				dataItem.value != null ? Number(dataItem.value) * coefficient : '';

			if (acc[index]) {
				acc[index] = {
					...acc[index],
					[`date-${trendIndex}`]: formattedDate,
					[`col-${trendIndex}`]: value.toString().replaceAll('.', ','),
				};
			} else {
				acc.push({
					[`col-${trendIndex}`]: value.toString().replaceAll('.', ','),
					[`date-${trendIndex}`]: formattedDate,
				});
			}
		});
		return acc;
	}, []);

	const columnsForExcel = createExcelHeaders(trends);
	return { preparedData, columnsForExcel };
}
export function createExcelHeaders(trends: ComparisonChartData[]) {
	const newColumns: {
		key: string;
		header: string;
		width: number;
	}[] = [];
	trends.forEach((trend, index) => {
		newColumns.push({
			key: `date-${index}`,
			header: '',
			width: 35,
		});
		newColumns.push({
			key: `col-${index}`,
			header: '',
			width: 35,
		});
	});
	return newColumns;
}
