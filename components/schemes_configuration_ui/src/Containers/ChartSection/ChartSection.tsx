import { useEffect, useMemo, useState } from 'react';
import { AutoSizer, Column, SortDirectionType, Table } from 'react-virtualized';
import clsx from 'clsx';
import { parse } from 'date-fns';
import { useStore } from 'effector-react';
import { Options, Series } from 'highcharts';

import chartDataAdapter, {
	createYaxes,
} from '../../Adapters/chart/chartDataAdapter';
import {
	modifyHeaders,
	tableDataAdapter,
} from '../../Adapters/chart/convertChartDataToTable';
import useInterval from '../../Facades/useIntreval';
import { $activeChart } from '../../Models/ActiveChart';
import {
	fetchChartData,
	setDateColumnSortDirection,
	setTrendVisibleState,
} from '../../Models/ActiveChart/events';
import { $chartProperties } from '../../Models/ChartProperties';
import Chart from '../../UI/Chart';
import HorizontalResizer from '../../UI/HorizontalResizer';
import Spinner from '../../UI/Spinner';
import { DateFormat } from '../../Utils/dateUtils';
import { getYAxisRangeConfig } from '../../Utils/trends';
import ChartAggegateInfo from '../ChartAggegateInfo';

import SchemeSectionProps from './types';

import 'react-virtualized/styles.css';
import styles from './ChartSection.module.css';

function ChartSection({ className }: SchemeSectionProps) {
	const {
		isLoading,
		tableHeader,
		chartData,
		updateDelay,
		isUpdateChartEnabled,
		unitList,
		isMultiYaxesEnabled,
		isRelativeZeroEnabled,
		dateColumnSortDirection,
	} = useStore($activeChart);

	const { activePlotLines } = useStore($chartProperties);

	const [activeIndex, setActiveIndex] = useState<number>(-1);
	const [selectedDate, setActiveDate] = useState<Date | null>(null);

	const selectedUnit = useMemo(() => {
		return (
			unitList.find((item) => item.isSelected) || {
				label: '',
				coefficient: 1,
				value: '',
				isSelected: true,
			}
		);
	}, [unitList]);
	const tableData = useMemo(() => {
		const tableData = tableDataAdapter(
			chartData,
			selectedUnit?.coefficient || 1,
		);
		return dateColumnSortDirection === 'ASC' ? tableData : tableData.reverse();
	}, [chartData, selectedUnit?.coefficient, dateColumnSortDirection]);

	const sort = ({ sortDirection }: { sortDirection: SortDirectionType }) => {
		setDateColumnSortDirection(sortDirection);
		tableData.reverse();
	};

	const series = chartDataAdapter(chartData, isMultiYaxesEnabled, selectedUnit);

	function handleLegendItemClick(this: Series) {
		const trend = this;
		setTrendVisibleState(Number(trend.userOptions.id));
	}

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
	const yAxisRangeConfig = getYAxisRangeConfig(
		chartData,
		isRelativeZeroEnabled,
	);

	const yAxes = isMultiYaxesEnabled
		? createYaxes(chartData, isRelativeZeroEnabled, activePlotLines)
		: [
				{
					allowDecimals: true,
					title: {
						text: null,
					},
					...yAxisRangeConfig,
					plotLines: activePlotLines,
				},
		  ];

	const chartOptions: Options = {
		yAxis: [...yAxes],
		plotOptions: {
			series: {
				point: {
					events: {
						click: function () {
							const point = this;
							handleDateSelect(new Date(point.x));
						},
					},
				},
				events: {
					legendItemClick: handleLegendItemClick,
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
	};

	const dynamicHeaders = modifyHeaders(tableHeader, chartData);

	useInterval(() => {
		if (isUpdateChartEnabled)
			Promise.allSettled(
				chartData.map((item) => {
					if (item.asqlGroup) fetchChartData(item.asqlGroup);
				}),
			);
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

	const MIN_TABLE_WIDTH = 100;

	return (
		<div className={clsx(styles.root, className)}>
			<div className={styles.wrapper}>
				{isLoading ? (
					<div className={styles.spinner}>
						<Spinner className={styles.loading} />
					</div>
				) : (
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
										width={width < MIN_TABLE_WIDTH ? MIN_TABLE_WIDTH : width}
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
										sortBy={'date'}
										sortDirection={dateColumnSortDirection}
										sort={sort}
										scrollToIndex={activeIndex != -1 ? activeIndex : undefined}
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
												dataKey={item.accessor}
												width={item.minWidth as number}
												key={item.accessor}
												headerStyle={{ backgroundColor: '#ffffff' }}
											/>
										))}
									</Table>
								)}
							</AutoSizer>
						</HorizontalResizer>
					</>
				)}
			</div>
		</div>
	);
}

export default ChartSection;
