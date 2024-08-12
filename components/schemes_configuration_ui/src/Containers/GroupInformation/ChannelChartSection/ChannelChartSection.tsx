import clsx from 'clsx';

import ChartSection from '../../ChannelChartContainers/ChartSection';
import ChartSettings from '../../ChannelChartContainers/ChartSettings';
import ChartSectionProps from '../types';

import styles from './ChartSection.module.css';

function ChannelChartSection({ className }: ChartSectionProps) {
	return (
		<div className={clsx(styles.root, className)}>
			<ChartSettings className={styles.chart_settings} />
			<ChartSection className={styles.chart_section} />
		</div>
	);
}

export default ChannelChartSection;
