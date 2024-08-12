import { useMemo, useState } from 'react';
import { AutoSizer, Column, SortDirectionType, Table } from 'react-virtualized';
import clsx from 'clsx';
import { useStore } from 'effector-react';
import { Options, SeriesLegendItemClickCallbackFunction } from 'highcharts';

import dynamicChartDataAdapter, {
	tableDataAdapter,
} from '../../Adapters/chart/dynamicChartAdapter';
import useInterval from '../../Facades/useIntreval';
import { $user } from '../../Models/Auth';
import { $dynamicChart } from '../../Models/DynamicChart';
import {
	setDateColumnSortDirection,
	updateCharts,
} from '../../Models/DynamicChart/events';
import Chart from '../../UI/Chart';
import HorizontalResizer from '../../UI/HorizontalResizer';
import { getYAxisRangeConfig } from '../../Utils/trends';
import DynamicChartSettings from '../DynamicChartSettings';

import DynamicChartSectionProps from './types';
import { createYaxes, modifyHeaders } from './utils';

import styles from './DynamicChartSection.module.css';

function DynamicChartSection({ className }: DynamicChartSectionProps) {
	const {
		tableHeader,
		chartData,
		isLoading,
		updateDelay,
		isUpdateChartEnabled,
		isMultiYaxesEnabled,
		isRelativeZeroEnabled,
		dateColumnSortDirection,
	} = useStore($dynamicChart);
	const user = useStore($user);

	const [isSumColumnVisible, setColumnVisible] = useState(false);
	const dynamicHeaders = modifyHeaders(tableHeader, chartData);

	const series = useMemo(
		() =>
			!isLoading
				? dynamicChartDataAdapter(
						chartData,
						isMultiYaxesEnabled,
						isSumColumnVisible,
				  )
				: [],
		[isLoading, chartData, isMultiYaxesEnabled, isSumColumnVisible],
	);

	const { tableData, aggregateSumData } = useMemo(() => {
		const { result: tableData, aggregateSumData } = !isLoading
			? tableDataAdapter(chartData)
			: { result: [], aggregateSumData: [] };

		return {
			tableData:
				dateColumnSortDirection === 'ASC' ? tableData : tableData.reverse(),
			aggregateSumData,
		};
	}, [isLoading, chartData, dateColumnSortDirection]);

	const yAxisRangeConfig = getYAxisRangeConfig(
		chartData,
		isRelativeZeroEnabled,
	);

	const yAxes = isMultiYaxesEnabled
		? createYaxes(chartData, isSumColumnVisible, isRelativeZeroEnabled)
		: [
				{
					allowDecimals: true,
					title: {
						text: null,
					},
					...yAxisRangeConfig,
				},
		  ];

	const dynamicHeadersWithSum = useMemo(() => {
		return dynamicHeaders.map((item) => {
			if (item.accessor === 'sum')
				return {
					...item,
					isVisible: isSumColumnVisible,
				};
			return item;
		});
	}, [dynamicHeaders, isSumColumnVisible]);

	const [activeIndex, setActiveIndex] = useState<number>(-1);

	const handleItemClick: SeriesLegendItemClickCallbackFunction = function (
		this,
	) {
		const {
			userOptions: { name, visible },
		} = this;
		if (name === 'Сумма') {
			setColumnVisible(!visible);
		}
	};
	const chartOptions: Options = {
		chart: {
			marginTop: 90,
			events: {
				click: function () {
					setActiveIndex(this.hoverPoint?.index || 0);
				},
			},
		},
		yAxis: yAxes,
		plotOptions: {
			line: {
				events: {
					legendItemClick: handleItemClick,
				},
				showInLegend: true,
			},
			series: {
				point: {
					events: {
						click: function () {
							const point = this;
							setActiveIndex(point.index);
						},
					},
				},
			},
		},
	};
	const sort = ({ sortDirection }: { sortDirection: SortDirectionType }) => {
		setDateColumnSortDirection(sortDirection);
		tableData.reverse();
	};

	useInterval(() => {
		if (isUpdateChartEnabled && user) updateCharts(user.preferredUsername);
	}, updateDelay * 1000);

	return (
		<div className={clsx(styles.root, className)}>
			<DynamicChartSettings />
			<div style={{ height: '100%', position: 'relative' }}>
				<HorizontalResizer
					firstElementMinHeight={160}
					secondElementMinHeight={150}
					className={styles.resizer}
				>
					<Chart series={series} chartOptions={chartOptions} />
					<AutoSizer style={{ backgroundColor: '#ffffff', marginTop: '1em' }}>
						{({ height, width }) => (
							<Table
								height={height}
								width={width}
								sortBy={'date'}
								sortDirection={dateColumnSortDirection}
								sort={sort}
								headerHeight={30}
								rowHeight={30}
								className={styles.table}
								rowCount={tableData.length}
								rowGetter={({ index }) => tableData[index]}
								onRowClick={(item) => {
									setActiveIndex(item.index);
								}}
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
								{dynamicHeadersWithSum.map((item) =>
									item.isVisible ? (
										<Column
											label={item.text}
											dataKey={item.accessor || ''}
											width={400}
											key={item.accessor}
											headerStyle={{ backgroundColor: '#ffffff' }}
										/>
									) : null,
								)}
							</Table>
						)}
					</AutoSizer>
				</HorizontalResizer>
				<div className={styles.bottom_row}>
					<div className={styles.aggregate_title}>Итого за период</div>
					{aggregateSumData.map((value, index) => (
						<div key={`${value}-${index}`} className={styles.aggregate_value}>
							{value}
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

export default DynamicChartSection;
