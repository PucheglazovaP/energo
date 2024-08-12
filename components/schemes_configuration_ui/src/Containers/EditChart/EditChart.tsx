import Chart from '../../UI/Chart';

import useChart from './useChart';

function EditChart() {
	const { series, chartOptions } = useChart();
	return <Chart series={series} chartOptions={chartOptions} />;
}

export default EditChart;
