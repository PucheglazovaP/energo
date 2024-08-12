import Chart from '../../UI/Chart';
import ConfigurationBlock from '../ConfigurationBlock';

import useChart from './useChart';

import styles from './EditChart.module.css';

function EditCondensateDrainChart() {
	const { series, chartOptions } = useChart();
	return (
		<div className={styles.root}>
			<ConfigurationBlock />
			<Chart series={series} chartOptions={chartOptions} />
		</div>
	);
}

export default EditCondensateDrainChart;
