import React from 'react';
import { TableCellProps } from 'react-virtualized';
import { format } from 'date-fns';
import {
	DashStyleValue,
	PointOptionsObject,
	SeriesOptionsType,
	SeriesZonesOptionsObject,
} from 'highcharts';

import ChannelCell from '../../Containers/ChannelChartContainers/ChannelCell';
import { ChartValueWithStatus } from '../../Models/ActiveChannelChart/types';
import { ChartValue } from '../../Models/ActiveChart/types';
import {
	ChannelsChartDataResponse,
	statusDetails,
	Trend,
} from '../../Shared/types';
import { ITableColumn } from '../../UI/Table/types';
import { DateFormat } from '../../Utils/dateUtils';

function cellRenderer({ cellData, rowData }: TableCellProps): React.ReactNode {
	const { status, color } = rowData;
	return <ChannelCell value={cellData} status={status} color={color || ''} />;
}

export default function channelsChartDataAdapter(result: string) {
	const data: ChannelsChartDataResponse[] =
		JSON.parse(result).Response.Tables[0].Rows;
	const channelsData: ChartValueWithStatus[] = [];
	const chartData = data.reduce<Map<number, ChartValue[]>>((statuses, item) => {
		const code = item.code == null ? 0 : item.code;
		const statusData = statuses.get(code);
		const status = statusDetails[code as keyof typeof statusDetails];
		channelsData.push({
			status: status.message,
			date: item.dat,
			value: item.dan,
			color: status.color,
		});
		if (statusData) {
			statuses.set(code, [...statusData, { date: item.dat, value: item.dan }]);
		} else statuses.set(code, [{ date: item.dat, value: item.dan }]);
		return statuses;
	}, new Map());
	return { chartData, channelsData };
}

export function chartDataAdapter(
	trends: Trend[],
	coefficient?: number,
): SeriesOptionsType[] {
	const data = trends.reduce<PointOptionsObject[]>((prev, trend) => {
		const trendData = trend.data.map((item) => {
			return {
				y:
					item.value != null
						? Number((item.value * (coefficient || 1)).toFixed(trend.round))
						: null,
				x: new Date(item.date).getTime(),
				color: item.value != null ? (trend.color as string) : 'red',
				dashStyle: item.value != null ? 'solid' : ('dot' as DashStyleValue),
			};
		}) as PointOptionsObject[];
		return [...prev, ...trendData];
	}, []);
	const sortedData = data.sort((a, b) => (a.x && b.x ? a.x - b.x : 0));

	let currentColor = '';
	let currentDashStyle: DashStyleValue | undefined = 'Solid';
	const zones = sortedData.reduce<SeriesZonesOptionsObject[]>(
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

	return [
		{
			name: 'Норма',
			data: sortedData,
			dataLabels: {
				enabled: false,
			},
			zoneAxis: 'x',
			zones,
			visible: true,
			type: 'line',
			turboThreshold: 0,
			color: '#616160',
			step: `center`,
			connectNulls: true,
		},
		{
			name: 'Ниже минимального',
			dataLabels: {
				enabled: false,
			},
			visible: true,
			type: 'line',
			turboThreshold: 0,
			color: '#C7A6CD',
			step: `center`,
		},
		{
			name: 'Больше Максимального',
			dataLabels: {
				enabled: false,
			},
			visible: true,
			type: 'line',
			turboThreshold: 0,
			color: '#FDD58B',
			step: `center`,
		},
		{
			name: 'Ошибка конвертирования FLOAT',
			dataLabels: {
				enabled: false,
			},
			visible: true,
			type: 'line',
			turboThreshold: 0,
			color: '#92BC8C',
			step: `center`,
		},
		{
			name: 'Ошибка приема с OPC',
			dataLabels: {
				enabled: false,
			},
			visible: true,
			type: 'line',
			turboThreshold: 0,
			color: '#F8B176',
			step: `center`,
		},
	];
}
/* export function tableDataAdapter(trends: Trend[], coefficient?: number) {
	const data = trends.reduce<ITableBody[]>((acc, trend) => {
		trend.data.forEach((dataItem) => {
			const formattedDate = format(new Date(dataItem.date), 'HH:mm yyyy-MM-dd');
			const cellValue =
				dataItem.value != null
					? Number((dataItem.value * (coefficient || 1)).toFixed(trend.round))
					: 'Н/Д';
			acc.push({
				dataLine: [
					{ accessor: 'date', text: formattedDate },
					{
						accessor: `col-1`,
						text: cellValue,
						renderCell: () => (
							<ChannelCell
								value={cellValue}
								status={trend.name}
								color={trend.color || ''}
							/>
						),
					},
				],
				rowClassName: 'chart_table_row',
			});
		});

		return acc;
	}, []);

	return data;
} */
export function tableDataAdapter(
	data: ChartValueWithStatus[],
	round: number,
	coefficient?: number,
) {
	return data.map((dataItem) => {
		const formattedDate = format(
			new Date(dataItem.date),
			DateFormat.DefaultDisplayFormatWithSeconds,
		);
		const cellValue =
			dataItem.value != null
				? Number((dataItem.value * (coefficient || 1)).toFixed(round))
				: 'Н/Д';
		return {
			date: formattedDate,
			col1: cellValue,
			status: dataItem.status,
			color: dataItem.color,
		};
	});
}
export function modifyHeaders(tableHeader: ITableColumn[]) {
	const dateColumn = tableHeader.find((item) => item.accessor === 'date');
	return [
		{
			...dateColumn,
			renderCell: undefined,
		},
		{
			accessor: `col1`,
			text: 'Показатель',
			minWidth: 400,
			renderCell: cellRenderer,
		},
	];
}
