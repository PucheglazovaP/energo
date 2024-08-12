import React, { useEffect, useState } from 'react';
import { Options } from 'highcharts';

import Chart from '../../Chart';
import EditableField from '../../EditableField';
import {
	getAngleValues,
	getChartInfoPositionValues,
	getChartPositionValues,
	getChartSeriesConfiguration,
} from '../utils';

import { EditStatusIndicatorProps } from './types';

import styles from './StatusIndicator.module.css';

function StatusIndicator(props: EditStatusIndicatorProps) {
	const {
		objectValue,
		handleClick = () => {},
		isSelected,
		onContextMenu,
	} = props;

	const [position, setPosition] = useState<{
		x: number;
		y: number;
	}>({
		x: objectValue.x,
		y: objectValue.y,
	});
	const [size, setSize] = useState<{
		width: number;
		height: number;
	}>({
		width: objectValue.length,
		height: objectValue.height,
	});

	const borderColor = isSelected ? '#FAB82E' : '';

	const { startAngle, endAngle } = getAngleValues(objectValue.degree);
	const {
		size: chartSize,
		x,
		y,
		chartWidth,
	} = getChartPositionValues(objectValue.degree);
	const {
		styles: { flexDirection, position: stylePosition, left, top },
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
			enabled: false,
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
			size: chartSize,
			center: [x, y],
			background: paneBackground,
		},
		yAxis,
		plotOptions: {
			solidgauge: {
				stickyTracking: false,
			},
		},
	};
	const handleContextMenu = (evt: React.MouseEvent) => {
		evt.preventDefault();
		if (onContextMenu) {
			onContextMenu(evt, objectValue);
		}
	};

	useEffect(() => {
		setPosition({ x: objectValue.x, y: objectValue.y });
		setSize({ width: objectValue.length, height: objectValue.height });
	}, [objectValue.x, objectValue.y, objectValue.length, objectValue.height]);

	return (
		<foreignObject
			x={position.x}
			y={position.y}
			width={size.width}
			height={size.height}
			onClick={handleClick}
			onContextMenu={handleContextMenu}
		>
			<div
				className={styles.chart_wrapper}
				style={{ flexDirection, borderColor }}
			>
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
						{objectValue.d2Value}
					</div> */}
				</div>
				<div
					className={styles.chart_info_section}
					style={{ position: stylePosition, left, top }}
				>
					<div className={styles.chart_info_headers}>
						{objectValue.isHeader1Visible ? (
							<EditableField value={objectValue.header1} />
						) : (
							''
						)}
						{isHeaderDividerVisible ? ' / ' : ''}
						{objectValue.isHeader2Visible ? (
							<EditableField value={objectValue.header2} />
						) : (
							''
						)}
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
