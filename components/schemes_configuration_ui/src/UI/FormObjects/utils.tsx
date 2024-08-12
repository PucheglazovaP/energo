import { CSSProperties } from 'react';
import ReactDOMServer from 'react-dom/server';
import {
	PaneBackgroundOptions,
	SeriesOptionsType,
	YAxisOptions,
} from 'highcharts';
import { TooltipFormatterCallbackFunction } from 'highcharts';

import {
	StatusIndicatorConfiguration,
	TransparentConfiguration,
} from '../../Shared/Types/formObject';

import { ParametersValue } from './Transparent/types';

import styles from './StatusIndicator/StatusIndicator.module.css';

export function calculateBorderRadius(value: number) {
	const minPixels = 0;
	const maxPixels = 50;
	const minPercent = 50;
	const maxPercent = 100;

	if (value <= 50) {
		return `${(maxPixels - minPixels) * (value / 50)}px`;
	}
	return `${minPercent + (maxPercent - minPercent) * ((value - 50) / 50)}%`;
}

export function convertAlignValue(value: string) {
	return ParametersValue[value as keyof typeof ParametersValue];
}
export function getEmergencyEventsCountLabel(count: number) {
	if (count === 0) return '';
	if (count === 1) return '';
	if (count > 99) return '99+';
	return count;
}

export const getLength = (x: number, y: number) => Math.sqrt(x * x + y * y);

export function getTextVerticalValue(
	size: {
		width: number;
		height: number;
	},
	position: {
		x: number;
		y: number;
	},
	value: ParametersValue,
) {
	switch (value) {
		case ParametersValue.Center:
			return position.y + size.height / 1.9;
		case ParametersValue.Top:
			return position.y + size.height / 3;
		case ParametersValue.Bottom:
			return position.y + size.height / 1.1;
	}
}
export function getMaxValueForChart(value: number) {
	const numStr = value.toString();
	const numLength = numStr.length;

	return Math.pow(10, numLength);
}
export function getTextHorizontalValue(
	size: {
		width: number;
		height: number;
	},
	position: {
		x: number;
		y: number;
	},
	value: ParametersValue,
) {
	switch (value) {
		case ParametersValue.Center:
			return position.x + size.width / 2;
		case ParametersValue.Left:
			return position.x;
		case ParametersValue.Right:
			return position.x + size.width;
	}
}

// StatusIndicatorUtils

export function getAngleValues(degree: number) {
	switch (degree) {
		case 180:
			return { startAngle: -90, endAngle: 90 };
		case 270:
			return { startAngle: -180, endAngle: 90 };
		case 360:
			return { startAngle: -180, endAngle: 180 };
	}
	return { startAngle: -90, endAngle: 360 };
}

export function getChartPositionValues(degree: number) {
	switch (degree) {
		case 180:
			return {
				size: '200%',
				x: '50%',
				y: '100%',
				chartWrapperHeight: '77%',
				chartWidth: '100%',
			};
		case 270:
			return {
				size: '100%',
				x: '47%',
				y: '50%',
				chartWrapperHeight: '100%',
				chartWidth: '65%',
			};
		case 360:
			return {
				size: '100%',
				x: '50%',
				y: '50%',
				chartWrapperHeight: '100%',
				chartWidth: '58%',
			};
	}
	return { size: '220%', x: '45%', y: '100%' };
}

export function getChartInfoPositionValues(degree: number): {
	styles: CSSProperties;
	d2LabelYCoord: string;
} {
	switch (degree) {
		case 180:
			return {
				styles: {
					flexDirection: 'column',
					position: 'static',
					top: '0px',
					left: '0px',
				},
				d2LabelYCoord: '85%',
			};
		case 270:
			return {
				styles: {
					flexDirection: 'row',
					position: 'absolute',
					top: '55%',
					left: '48%',
				},
				d2LabelYCoord: '62%',
			};
		case 360:
			return {
				styles: {
					flexDirection: 'row',
					position: 'absolute',
					top: '0px',
					left: '67%',
				},
				d2LabelYCoord: '55%',
			};
	}
	return { styles: { flexDirection: 'column' }, d2LabelYCoord: '100%' };
}

export function getChartStatusColor(objectValue: StatusIndicatorConfiguration) {
	const {
		statusCode,
		normalIndicatorColor,
		warningIndicatorColor,
		emergencyIndicatorColor,
		turnedOffIndicatorColor,
		errorIndicatorColor,
	} = objectValue;
	switch (statusCode) {
		case 1:
			return normalIndicatorColor;
		case 2:
			return emergencyIndicatorColor;
		case 3:
			return warningIndicatorColor;
		case 4:
			return turnedOffIndicatorColor;
		case 5:
			return errorIndicatorColor;
	}
	return errorIndicatorColor;
}

export function getChartStatusComment(
	objectValue: StatusIndicatorConfiguration,
) {
	const {
		statusCode,
		normalIndicatorComment,
		emergencyIndicatorComment,
		warningIndicatorComment,
		turnedOffIndicatorComment,
		errorIndicatorComment,
	} = objectValue;
	switch (statusCode) {
		case 1:
			return normalIndicatorComment;
		case 2:
			return emergencyIndicatorComment;
		case 3:
			return warningIndicatorComment;
		case 4:
			return turnedOffIndicatorComment;
		case 5:
			return errorIndicatorComment;
	}
	return errorIndicatorComment;
}

export function getTransparentText(objectValue: TransparentConfiguration) {
	if (objectValue.isLinkEnabled)
		return !objectValue.notcapt ? objectValue.text || 'Ссылка' : 'Ссылка';

	const unitName = objectValue.showUnit ? objectValue.unitName : '';
	let transparentValue: string | number = '';
	if (objectValue.groupId !== 9999 && objectValue.groupId) {
		if (objectValue.value == null) transparentValue = '---';
		else transparentValue = objectValue.value;
	}
	return `${
		!objectValue.notcapt ? objectValue.text || '' : ''
	} ${transparentValue} ${unitName || ''}`;
}

export function getChartSeriesConfiguration(
	objectValue: StatusIndicatorConfiguration,
) {
	const { isD2ValueVisible } = objectValue;
	if (isD2ValueVisible) {
		const preparedD1Value =
			Number(objectValue.d1Value) < 0 ? 0 : objectValue.d1Value;
		const preparedD2Value =
			Number(objectValue.d2Value) < 0 ? 0 : objectValue.d2Value;
		const preparedD3Value =
			Number(objectValue.d3Value) < 0 ? 0 : objectValue.d3Value;
		const maxValueForChart = Math.max(
			objectValue.d1Value || 0,
			objectValue.d2Value || 0,
			objectValue.d3Value || 0,
		);
		const series: SeriesOptionsType[] = [
			{
				name: '',
				type: 'solidgauge',
				data: [
					{
						color: '#cccccc',
						radius: '100%',
						innerRadius: '92%',
						y: Math.min(preparedD1Value || 0, preparedD2Value || 0),
						dataLabels: {
							enabled: false,
						},
					},
					{
						name: getChartStatusComment(objectValue),
						color: getChartStatusColor(objectValue),
						radius: '80%',
						innerRadius: '55%',
						y: preparedD3Value,
						dataLabels: {
							enabled: true,
							borderColor: 'transparent',
							y: -17,
							overflow: 'allow',
							crop: false,
							style: {
								fontWeight: '500',
								fontSize: '16px',
							},
						},
					},
				],
			},
		];
		const paneBackground: PaneBackgroundOptions[] = [
			{
				backgroundColor: '#efefef',
				innerRadius: '55%',
				outerRadius: '80%',
				borderWidth: 0,
				shape: 'arc',
			},
			{
				innerRadius: '92%',
				outerRadius: '100%',
				backgroundColor: '#eaeaea',
				borderWidth: 0,
				shape: 'arc',
			},
		];
		const yAxis: YAxisOptions[] = [
			{
				min: 0,
				max: maxValueForChart,
				tickPosition: 'outside',
				tickWidth: 0,
				lineWidth: 0,
				tickLength: 2,
				tickmarkPlacement: 'on',
				minorTickLength: 7,
				minorTickInterval: objectValue.isScaleBarEnabled
					? objectValue.scaleBar
					: undefined,
				tickPositions: [preparedD1Value || -1, preparedD2Value || -1],
				labels: {
					distance: 10,
					enabled: true,
					style: {
						fontWeight: '500',
						fontSize: '14px',
						color: '#000000',
					},
				},
				zIndex: 45,
			},
		];
		return { series, paneBackground, yAxis };
	} else {
		const preparedD1Value =
			Number(objectValue.d1Value) < 0 ? 0 : objectValue.d1Value;
		const preparedD3Value =
			Number(objectValue.d3Value) < 0 ? 0 : objectValue.d3Value;
		const maxValueForChart = Math.max(
			objectValue.d1Value || 0,
			objectValue.d3Value || 0,
		);
		const series: SeriesOptionsType[] = [
			{
				name: '',
				type: 'solidgauge',
				data: [
					{
						color: getChartStatusColor(objectValue),
						radius: '90%',
						innerRadius: '55%',
						y: Math.min(preparedD3Value || 0, preparedD1Value || 0),
						dataLabels: {
							enabled: true,
							borderColor: 'transparent',
							y: -17,
							overflow: 'allow',
							crop: false,
							style: {
								fontWeight: '500',
								fontSize: '16px',
							},
						},
					},
				],
			},
		];
		const paneBackground: PaneBackgroundOptions[] = [
			{
				backgroundColor: '#efefef',
				innerRadius: '55%',
				outerRadius: '90%',
				borderWidth: 0,
				shape: 'arc',
			},
		];
		const yAxis: YAxisOptions[] = [
			{
				min: 0,
				max: maxValueForChart,
				tickPosition: 'inside',
				tickWidth: 0,
				lineWidth: 0,
				tickLength: 2,
				tickmarkPlacement: 'on',
				minorTickLength: 7,
				minorTickInterval: objectValue.isScaleBarEnabled
					? objectValue.scaleBar
					: undefined,
				tickPositions: [maxValueForChart],
				labels: {
					distance: 10,
					enabled: true,
					style: {
						fontWeight: '500',
						fontSize: '14px',
						color: '#000000',
					},
				},
				zIndex: 45,
			},
		];
		return { series, paneBackground, yAxis };
	}
}
export const tooltipFormatter: TooltipFormatterCallbackFunction = function (
	this,
) {
	const {
		point: { name },
	} = this;
	return ReactDOMServer.renderToString(
		<>{name && <div className={styles.tooltip}>{name}</div>}</>,
	);
};
