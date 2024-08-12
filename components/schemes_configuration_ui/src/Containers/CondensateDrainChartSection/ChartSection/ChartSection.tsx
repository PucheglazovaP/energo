import { useMemo, useState } from 'react';
import clsx from 'clsx';
import { parse } from 'date-fns';
import { useStore } from 'effector-react';
import { Options } from 'highcharts';

import chartDataAdapter, {
	createYaxes,
	tableDataAdapter,
} from '../../../Adapters/chart/condensateDrainAdapter';
import { $activeChart } from '../../../Models/ActiveCondensateDrainChart';
import Chart from '../../../UI/Chart';
import HorizontalResizer from '../../../UI/HorizontalResizer';
import Spinner from '../../../UI/Spinner';
import Table from '../../../UI/Table';
import { DateFormat } from '../../../Utils/dateUtils';
import SchemeSectionProps from '../types';

import styles from './ChartSection.module.css';

function CondensateDrainChartSection({ className }: SchemeSectionProps) {
	const {
		isLoading,
		tableHeader,
		channelsChartData,
		vertAxisName,
		volumeOfMergedCondensate,
	} = useStore($activeChart);

	const [selectedDate, setActiveDate] = useState<Date | null>(null);

	const tableData = tableDataAdapter(volumeOfMergedCondensate);
	const series = chartDataAdapter(channelsChartData, volumeOfMergedCondensate);

	const yAxes = createYaxes(vertAxisName);

	const activeIndex = useMemo(() => {
		let rowIndex = -1;
		if (selectedDate != null)
			rowIndex = tableData.findIndex((row) => {
				const date = row.dataLine.find((item) => item.accessor === 'date');
				if (date) {
					const formattedDate = parse(
						date.text as string,
						DateFormat.DefaultDisplayFormatWithSeconds,
						new Date(),
					);
					return formattedDate.getTime() === selectedDate?.getTime();
				}
			});
		return rowIndex;
	}, [selectedDate, tableData]);

	const chartOptions: Options = {
		yAxis: [...yAxes],
		plotOptions: {
			series: {
				point: {
					events: {
						click: function () {
							const point = this;
							setActiveDate(new Date(point.x));
						},
					},
				},
			},
		},
		chart: {
			events: {
				click: function () {
					setActiveDate(
						this.hoverPoint?.category
							? new Date(this.hoverPoint?.category)
							: new Date(),
					);
					/* 					const xAxis = this.xAxis[0];
					const clickX = xAxis.toValue(e.chartX);
					const points = this.series[0].points;
					let closestPoint = points[0];
					let minDistance = Number.MAX_VALUE;

					for (let i = 0; i < points.length; i++) {
						const distance = Math.abs(points[i].x - clickX);
						if (distance < minDistance) {
							minDistance = distance;
							closestPoint = points[i];
						}
					}
					if (closestPoint) {
						setActiveDate(new Date(closestPoint.x));
					} */
				},
			},
		},
	};

	return (
		<div className={clsx(styles.root, className)}>
			<div className={styles.wrapper}>
				{isLoading ? (
					<div className={styles.spinner}>
						<Spinner className={styles.loading} />
					</div>
				) : (
					<>
						<HorizontalResizer
							firstElementMinHeight={160}
							secondElementMinHeight={150}
						>
							<Chart series={series} chartOptions={chartOptions} />
							<Table
								data={tableData}
								headers={tableHeader}
								className={styles.table}
								activeIndex={activeIndex}
							/>
						</HorizontalResizer>
					</>
				)}
			</div>
		</div>
	);
}

export default CondensateDrainChartSection;
