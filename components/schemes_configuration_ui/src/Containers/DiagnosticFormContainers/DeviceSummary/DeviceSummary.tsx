import Card from '../../../UI/Card/Card';

import { DeviceSummaryProps } from './types';
import useDeviceSummary from './useDeviceSummary';

import styles from './DeviceSummary.module.css';

function DeviceSummary(props: DeviceSummaryProps) {
	const { id } = props;
	const { list } = useDeviceSummary(id);
	return (
		<div className={styles.container}>
			<Card title={'Отчет по прибору'} items={list} />
		</div>
	);
}

export default DeviceSummary;
