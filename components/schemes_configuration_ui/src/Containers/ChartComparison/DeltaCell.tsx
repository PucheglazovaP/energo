import DeltaIcon from '../../Icons/Delta';

import styles from './ChartComparison.module.css';

function DeltaCell({ value }: { value: number }) {
	return (
		<div className={styles.delta_cell}>
			<DeltaIcon className={styles.delta_icon} />
			<div className={styles.delta_cell_value}>{value}</div>
		</div>
	);
}

export default DeltaCell;
