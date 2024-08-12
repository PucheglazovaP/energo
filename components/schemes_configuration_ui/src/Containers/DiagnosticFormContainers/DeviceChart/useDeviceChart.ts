import { useStore } from 'effector-react';
import { Options, SeriesColumnOptions } from 'highcharts';

import { $diagnosticChart } from '../../../Models/DiagnosticChart';

import { DeviceCallStatuses } from './types';
import { createDefaultSeries } from './utils';

function useDeviceChart(id: number) {
	const { shapes } = useStore($diagnosticChart);

	const chosenShape = shapes.get(id) || [];

	const series: SeriesColumnOptions[] =
		(chosenShape || []).reduce((acc, curr) => {
			// Get all keys except date
			const keys = Object.keys(curr).filter((key) => key !== 'date');
			// For each key search bar in the acc and update parameter with the same name
			for (let key of keys) {
				const isExist = acc.find((el) => el.id === key);
				// if bar is not exist for this key, create one
				if (!isExist) {
					acc.push(createDefaultSeries(key as DeviceCallStatuses));
				}
				const newData: [number, number] = [
					curr.date,
					curr[key as DeviceCallStatuses],
				];
				const bar = acc.find((el) => el.id === key);
				if (bar && bar.data) {
					bar.data.push(newData);
				}
			}
			return acc;
		}, [] as SeriesColumnOptions[]) || [];

	const options: Options = {
		chart: {
			type: 'column',
		},
		plotOptions: {
			column: {
				pointPadding: 0,
				groupPadding: 0,
				stacking: 'normal',
			},
		},
		yAxis: {
			title: {
				text: null,
			},
		},
		legend: {
			reversed: true,
		},
	};

	return {
		series,
		options,
	};
}

export default useDeviceChart;
