import Chart from '../../../UI/Chart';

import { DeviceChartProps } from './types';
import useDeviceChart from './useDeviceChart';

import styles from './DeviceChart.module.css';

function DeviceChart(props: DeviceChartProps) {
	const { id } = props;
	const { series, options } = useDeviceChart(id);
	return (
		<Chart className={styles.chart} series={series} chartOptions={options} />
	);
}

export default DeviceChart;
