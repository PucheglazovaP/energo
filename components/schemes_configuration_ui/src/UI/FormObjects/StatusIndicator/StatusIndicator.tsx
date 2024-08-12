import { Options } from 'highcharts';

import Chart from '../../Chart';
import {
	getAngleValues,
	getChartInfoPositionValues,
	getChartPositionValues,
	getChartSeriesConfiguration,
	tooltipFormatter,
} from '../utils';

import { StatusIndicatorProps } from './types';

import styles from './StatusIndicator.module.css';

function StatusIndicator(props: StatusIndicatorProps) {
	const { objectValue } = props;
	const { startAngle, endAngle } = getAngleValues(objectValue.degree);
	const { size, x, y, chartWidth } = getChartPositionValues(objectValue.degree);
	const {
		styles: { flexDirection, position, left, top },
	} = getChartInfoPositionValues(objectValue.degree);
	const isHeaderDividerVisible =
		objectValue.isHeader1Visible && objectValue.isHeader2Visible;

	const { series, yAxis, paneBackground } =
		getChartSeriesConfiguration(objectValue);

	const options: Options = {
		chart: {
			backgroundColor: '#ffffff',
			type: 'solidgauge',
			marginTop: undefined,
		},
		xAxis: {
			crosshair: false,
		},
		tooltip: {
			enabled: true,
			formatter: tooltipFormatter,
			delayForDisplay: 0,
		},
		title: {
			text: objectValue.nameObject,
			style: {
				fontSize: '14px',
				fontWeight: '500',
			},
			x: 0,
			align: 'left',
		},
		pane: {
			startAngle,
			endAngle,
			size,
			center: [x, y],
			background: paneBackground,
		},
		yAxis,
		plotOptions: {
			solidgauge: {
				stickyTracking: false,
				clip: false,
			},
		},
	};

	return (
		<foreignObject
			x={objectValue.x}
			y={objectValue.y}
			width={objectValue.length}
			height={objectValue.height}
		>
			<div className={styles.chart_wrapper} style={{ flexDirection }}>
				<div className={styles.chart_1} style={{ width: chartWidth }}>
					<Chart
						series={series}
						chartOptions={options}
						className={styles.chart}
					/>
					{/* 					<div
						className={styles.chart_info_d2_value}
						style={{ top: d2LabelYCoord }}
					>
						{objectValue.d3Value}
					</div> */}
				</div>
				<div
					className={styles.chart_info_section}
					style={{ position, left, top }}
				>
					<div className={styles.chart_info_headers}>
						{objectValue.isHeader1Visible ? `${objectValue.header1}` : ''}
						{isHeaderDividerVisible ? ' / ' : ''}
						{objectValue.isHeader2Visible ? `${objectValue.header2}` : ''}
					</div>
					<div className={styles.chart_info_values}>
						{objectValue.dg1Value || 'Н/Д'} / {objectValue.dg2Value || 'Н/Д'}
					</div>
				</div>
			</div>
		</foreignObject>
	);
}

export default StatusIndicator;
