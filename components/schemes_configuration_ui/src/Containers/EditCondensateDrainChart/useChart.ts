import { useStore } from 'effector-react';
import { Options } from 'highcharts';

import { createYaxes } from '../../Adapters/chart/condensateDrainAdapter';
import { $editMode } from '../../Models/EditMode';

function generateLinearData(start: number, end: number, step: number) {
	const data = [];
	for (let x = start; x <= end; x += step) {
		// Линейная функция
		const y = 3 * x + 5;
		data.push({ x, y });
	}
	return data;
}

// Функция для формирования массива данных для скачкообразного графика
function generateSawtoothChartData(start: number, end: number, step: number) {
	const data = [];
	for (let i = start; i <= end; i += step) {
		const y = Math.asin(Math.sin(i));
		data.push({ x: i, y: y });
	}
	return data;
}

// Функция для формирования массива данных для графика состоящего из точек максимума второго графика
function generateMaxPointsData(jumpData: { x: number; y: number }[]) {
	const data = [];
	for (let i = 0; i < jumpData.length; i++) {
		if (i === 0 || jumpData[i].y > jumpData[i - 1].y) {
			data.push(jumpData[i]);
		}
	}
	return data;
}

function useChart() {
	const { formParameters } = useStore($editMode);

	const axisLabel = formParameters.find(
		(item) => item.parameterName === 'vertAxisName',
	);
	const yAxes = createYaxes(String(axisLabel?.value || ''));
	const chartOptions: Options = {
		legend: {
			enabled: false,
		},
		yAxis: [...yAxes],
		xAxis: {
			labels: { enabled: false },
		},
		tooltip: {
			enabled: false,
		},
	};

	const resultData = generateLinearData(2, 40, 4);
	const data = generateSawtoothChartData(3, 40, 4);
	const discreteData = generateMaxPointsData(data);
	const series = [
		{
			name: 'Текущие показания',
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

	return {
		series: series,
		chartOptions: chartOptions,
	};
}

export default useChart;
