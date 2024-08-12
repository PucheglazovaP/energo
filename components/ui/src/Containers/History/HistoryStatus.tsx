import { HistoryStatusProps } from './types';
import styles from './History.module.scss';

function HistoryStatus(props: HistoryStatusProps) {
	const { status } = props;
	return <span className={styles.status}>{status}</span>;
}

export default HistoryStatus;
