import clsx from 'clsx';
import { format } from 'date-fns';
import {
	AlignValue,
	AxisTitleAlignValue,
	XrangePointOptionsObject,
} from 'highcharts';

import {
	BackendResponse,
	ChannelsChartDataResponse,
	chartParameters,
	FormParametersResponse,
	Trend,
	VolumeOfMergedCondensate,
	VolumeOfMergedCondensateResponse,
} from '../../Shared/types';
import { calculateY } from '../../Utils/convertValue';
import { DateFormat } from '../../Utils/dateUtils';
import { getNumber } from '../../Utils/guards';

import styles from '../../Containers/CondensateDrainChartSection/ChartSection/ChartSection.module.css';

export function channelsChartDataAdapter(result: string) {
	const { Response }: BackendResponse = JSON.parse(result);
	const data = Response.Tables[0].Rows as ChannelsChartDataResponse[];
	return data.map((item) => ({
		date: item.dat,
		value: item.dan,
	}));
}
export function volumeOfMergedCondensateDataAdapter(result: string) {
	const { Response }: BackendResponse = JSON.parse(result);
	const data = Response.Tables[0].Rows as VolumeOfMergedCondensateResponse[];
	return data.map((item) => ({
		date: item.DAT || item.dat,
		max: getNumber(item.MAXV, 'max'),
		min: getNumber(item.MINV, 'min'),
		diff: getNumber(item.DIFF, 'diff'),
		result: getNumber(item.RESULT, 'result'),
	}));
}
export function chartParametersAdapter(result: string) {
	const data: FormParametersResponse[] =
		JSON.parse(result).Response.Tables[0].Rows;
	const parameters = data.reduce<{ [parameter: string]: string | null }>(
		(prev, current) => {
			prev[
				chartParameters[
					current.НазваниеПараметра as keyof typeof chartParameters
				]
			] = current.ЗначениеПараметра;
			return prev;
		},
		{
			vertAxisName: '',
			channelNumber: null,
		},
	);
	return {
		vertAxisName: String(parameters.vertAxisName),
		channelNumber: Number(parameters.channelNumber),
	};
}
export function tableDataAdapter(
	volumeOfMergedCondensate: VolumeOfMergedCondensate[],
) {
	let resultSum = 0;
	if (volumeOfMergedCondensate.length > 0) {
		const tableData = volumeOfMergedCondensate.map((item, index) => {
			const formattedDate = format(
				new Date(item.date),
				DateFormat.DefaultDisplayFormatWithSeconds,
			);
			if (index === volumeOfMergedCondensate.length - 1)
				resultSum = Number(item.result);
			return {
				dataLine: [
					{ accessor: 'date', text: formattedDate },
					{
						accessor: 'max',
						text: item.max != null ? Number(item.max).toFixed(2) : 'Н/Д',
					},
					{
						accessor: 'min',
						text: item.min != null ? Number(item.min).toFixed(2) : 'Н/Д',
					},
					{
						accessor: 'value',
						text: item.diff != null ? Number(item.diff).toFixed(2) : 'Н/Д',
					},
					{
						accessor: 'result',
						text: item.result != null ? Number(item.result).toFixed(2) : 'Н/Д',
					},
				],
				rowClassName: styles.row,
			};
		});
		tableData.push({
			dataLine: [
				{ accessor: 'date', text: 'Всего за период' },
				{
					accessor: 'result',
					text: Number(resultSum).toFixed(2),
				},
			],
			rowClassName: clsx(styles.row, styles.bottom_row),
		});

		return tableData;
	}
	return [];
}

export function createYaxes(vertAxisName: string) {
	return [
		{
			allowDecimals: true,
			opposite: false,
			lineColor: '#fab82e',
			title: {
				text: vertAxisName,
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
			offset: 30,
			margin: 10,
			min: null,
		},
		{
			allowDecimals: true,
			opposite: true,
			lineColor: '#b5457c',
			title: {
				text: vertAxisName,
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
			offset: undefined,
			margin: 10,
			min: null,
		},
	];
}

export default function chartDataAdapter(
	channelsChartData: Trend[],
	volumeOfMergedCondensate: VolumeOfMergedCondensate[],
) {
	if (channelsChartData.length > 0) {
		const data = channelsChartData[0].data.map((item) => ({
			y: calculateY(item.value, 1, channelsChartData[0].round),
			x: new Date(item.date).getTime(),
		})) as XrangePointOptionsObject[];
		const discreteData = volumeOfMergedCondensate.map((item) => ({
			y: calculateY(item.diff, 1, channelsChartData[0].round),
			x: new Date(item.date).getTime(),
		})) as XrangePointOptionsObject[];
		const resultData = volumeOfMergedCondensate.map((item) => ({
			y: calculateY(item.result, 1, channelsChartData[0].round),
			x: new Date(item.date).getTime(),
		})) as XrangePointOptionsObject[];

		return [
			{
				name: channelsChartData[0].name,
				data: data,
				maxPointWidth: 63,
				dataLabels: {
					enabled: false,
				},
				type: 'line' as 'windbarb',
				turboThreshold: 0,
				visible: true,
				color: '#cccccc',
				lineWidth: 2,
			},
			{
				name: 'По дискретам',
				data: discreteData,
				maxPointWidth: 63,
				dataLabels: {
					enabled: false,
				},
				marker: {
					enabled: true,
					symbol: 'circle',
					radius: 3,
					fillColor: '#fab82e',
				},
				type: 'line' as 'windbarb',
				turboThreshold: 0,
				visible: true,
				yAxis: 0,
				color: '#fab82e',
				lineWidth: 2,
			},
			{
				name: 'Накопительный итог',
				data: resultData,
				maxPointWidth: 63,
				dataLabels: {
					enabled: false,
				},
				marker: {
					enabled: true,
					symbol: 'circle',
					radius: 3,
					fillColor: '#b5457c',
				},
				type: 'line' as 'windbarb',
				turboThreshold: 0,
				visible: true,
				yAxis: 1,
				color: '#b5457c',
				lineWidth: 2,
			},
		];
	}
	return [];
}

export function tableDataExcelAdapter(
	volumeOfMergedCondensate: VolumeOfMergedCondensate[],
) {
	const preparedData = volumeOfMergedCondensate.map((item) => {
		const formattedDate = format(
			new Date(item.date),
			DateFormat.DefaultDisplayFormatWithSeconds,
		);
		return {
			date: formattedDate,
			max: item.max,
			min: item.min,
			value: item.diff,
			result: item.result,
		};
	});
	const columnsForExcel = createExcelHeaders();
	return { preparedData, columnsForExcel };
}

export function createExcelHeaders() {
	return [
		{ header: 'Дата и время', key: 'date', width: 30 },
		{ header: 'Максимум', key: 'max', width: 30 },
		{ header: 'Минимум', key: 'min', width: 30 },
		{ header: 'Объем', key: 'value', width: 30 },
		{ header: 'Накопительный итог', key: 'result', width: 30 },
	];
}
