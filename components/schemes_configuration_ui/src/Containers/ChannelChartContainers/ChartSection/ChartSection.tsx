import { useEffect, useMemo, useState } from 'react';
import { AutoSizer, Column, SortDirectionType, Table } from 'react-virtualized';
import clsx from 'clsx';
import { parse } from 'date-fns';
import { useStore } from 'effector-react';
import {
	AlignValue,
	AxisTitleAlignValue,
	Options,
	SeriesLegendItemClickCallbackFunction,
} from 'highcharts';

import {
	chartDataAdapter,
	modifyHeaders,
	tableDataAdapter,
} from '../../../Adapters/chart/channelsChartDataAdapter';
import useInterval from '../../../Facades/useIntreval';
import { $activeChart } from '../../../Models/ActiveChannelChart';
import { fetchChannelsChartDataFx } from '../../../Models/ActiveChannelChart/effects';
import {
	fetchChartData,
	setDateColumnSortDirection,
} from '../../../Models/ActiveChannelChart/events';
import { $channels } from '../../../Models/Channels';
import { $navigation } from '../../../Models/Navigation';
import { TreeTypes } from '../../../Shared/types';
import Chart from '../../../UI/Chart';
import HorizontalResizer from '../../../UI/HorizontalResizer';
import Spinner from '../../../UI/Spinner';
import { DateFormat } from '../../../Utils/dateUtils';
import { getYAxisRangeConfig } from '../../../Utils/trends';
import ChartAggegateInfo from '../ChartAggegateInfo';

import { seriesCheckboxFormatter } from './Legend';
import { tooltipFormatter } from './Tooltip';
import ChartSectionProps from './types';

import 'react-virtualized/styles.css';
import styles from './ChartSection.module.css';

function ChartSection({ className }: ChartSectionProps) {
	const {
		tableHeader,
		chartData,
		updateDelay,
		isUpdateChartEnabled,
		isRelativeZeroEnabled,
		id,
		channelsData,
		unitList,
		dateColumnSortDirection,
		round,
	} = useStore($activeChart);
	const { treeType } = useStore($navigation);
	const { list: channels } = useStore($channels);
	const isLoading = useStore(fetchChannelsChartDataFx.pending);

	const selectedUnit = unitList.find((item) => item.isSelected);

	const unitName = useMemo(() => {
		let unit = '';
		switch (treeType) {
			case TreeTypes.Devices:
			case TreeTypes.Channels: {
				if (channels.length > 0) {
					const foundChannel = channels.find((n) => n.id === Number(id));
					if (foundChannel) {
						unit = foundChannel.unit;
					}
				}
				break;
			}
			default: {
				selectedUnit?.label || '';
			}
		}
		return unit;
	}, [id, treeType, channels, selectedUnit]);

	const tableData = useMemo(() => {
		const tableData = tableDataAdapter(channelsData, round);
		return dateColumnSortDirection === 'ASC' ? tableData : tableData.reverse();
	}, [chartData, dateColumnSortDirection]);

	const sort = ({ sortDirection }: { sortDirection: SortDirectionType }) => {
		setDateColumnSortDirection(sortDirection);
		tableData.reverse();
	};
	const series = useMemo(
		() => chartDataAdapter(chartData, selectedUnit?.coefficient || 1),
		[chartData, selectedUnit],
	);

	const [selectedDate, setActiveDate] = useState<Date | null>(null);
	const [activeIndex, setActiveIndex] = useState<number>(-1);

	const yAxisRangeConfig = getYAxisRangeConfig(
		chartData,
		isRelativeZeroEnabled,
	);
	const yAxes = useMemo(
		() => [
			{
				allowDecimals: true,
				title: {
					text: unitName,
					align: 'high' as AxisTitleAlignValue,
					y: -30,
					x: -30,
					rotation: 0,
					offset: 0,
					textAlign: 'left' as AlignValue,
					style: {
						fontWeight: '500',
						color: '#000000',
					},
				},
				...yAxisRangeConfig,
			},
		],
		[yAxisRangeConfig, unitName],
	);
	const handleItemClick: SeriesLegendItemClickCallbackFunction = function (
		this,
		event,
	) {
		event.preventDefault();
	};
	function handleDateSelect(date: Date) {
		setActiveDate(date);
		let rowIndex = -1;
		if (date != null)
			rowIndex = tableData.findIndex((row) => {
				const formattedDate = parse(
					row.date as string,
					DateFormat.DefaultDisplayFormatWithSeconds,
					new Date(),
				);
				return formattedDate.getTime() === date?.getTime();
			});
		setActiveIndex(rowIndex);
	}

	const chartOptions: Options = useMemo(
		() => ({
			yAxis: yAxes,
			tooltip: {
				borderWidth: 0,
				enabled: true,
				borderColor: 'transparent',
				shadow: false,
				shared: true,
				formatter: tooltipFormatter,
				useHTML: true,
				backgroundColor: 'transparent',
				style: {
					fontWeight: '375',
					fontSize: '14px',
					zIndex: 1000,
					color: '#FFFFFF',
				},
			},
			legend: {
				labelFormatter: seriesCheckboxFormatter,
			},
			plotOptions: {
				line: {
					events: {
						legendItemClick: handleItemClick,
					},
				},
				series: {
					allowPointSelect: false,
					point: {
						events: {
							click: function () {
								const point = this;
								handleDateSelect(new Date(point.x));
							},
						},
					},
				},
			},
			chart: {
				events: {
					click: function () {
						handleDateSelect(
							this.hoverPoint?.category
								? new Date(this.hoverPoint?.category)
								: new Date(),
						);
					},
				},
			},
		}),
		[yAxes],
	);

	const dynamicHeaders = modifyHeaders(tableHeader);

	useInterval(() => {
		if (isUpdateChartEnabled) fetchChartData();
	}, updateDelay * 1000);

	useEffect(() => {
		if (selectedDate != null) {
			let rowIndex = -1;
			rowIndex = tableData.findIndex((row) => {
				const formattedDate = parse(
					row.date as string,
					DateFormat.DefaultDisplayFormatWithSeconds,
					new Date(),
				);
				return formattedDate.getTime() === selectedDate?.getTime();
			});
			setActiveIndex(rowIndex);
		}
	}, [tableData]);

	return (
		<div className={clsx(styles.root, className)}>
			<div className={styles.wrapper}>
				{isLoading ? (
					<div className={styles.spinner}>
						<Spinner className={styles.loading} />
					</div>
				) : (
					id && (
						<>
							<ChartAggegateInfo />
							<HorizontalResizer
								firstElementMinHeight={160}
								secondElementMinHeight={150}
							>
								<Chart series={series} chartOptions={chartOptions} />
								<AutoSizer
									style={{ backgroundColor: '#ffffff', marginTop: '1em' }}
								>
									{({ height, width }) => (
										<Table
											height={height}
											width={width}
											headerHeight={30}
											rowHeight={30}
											className={styles.table}
											rowCount={tableData.length}
											rowGetter={({ index }) => tableData[index]}
											onRowClick={(item) => {
												const formattedDate = parse(
													item.rowData.date as string,
													DateFormat.DefaultDisplayFormatWithSeconds,
													new Date(),
												);
												setActiveDate(formattedDate);
												setActiveIndex(item.index);
											}}
											scrollToIndex={
												activeIndex != -1 ? activeIndex : undefined
											}
											sortBy={'date'}
											sortDirection={dateColumnSortDirection}
											sort={sort}
											headerClassName={styles.table_header}
											rowClassName={(info) =>
												clsx(
													styles.table_row,
													activeIndex != -1 &&
														info.index === activeIndex &&
														styles.table_row__active,
												)
											}
										>
											{dynamicHeaders.map((item) => (
												<Column
													label={item.text}
													dataKey={item.accessor || ''}
													width={400}
													key={item.accessor}
													headerStyle={{ backgroundColor: '#ffffff' }}
													cellRenderer={item.renderCell}
												/>
											))}
										</Table>
									)}
								</AutoSizer>
							</HorizontalResizer>
						</>
					)
				)}
			</div>
		</div>
	);
}

export default ChartSection;
