import DeviceConnection from '../DeviceConnection/DeviceConnection';
import DevicesStateTable from '../DevicesStateTable';

import styles from './DiagnosticCurrentState.module.css';

function DiagnosticCurrentState() {
	return (
		<div className={styles.diagnostic_form}>
			<div className={styles.diagnostic_connection}>
				<DeviceConnection />
			</div>
			<div className={styles.diagnostic_table_wrapper}>
				<div className={styles.diagnostic_table}>
					<DevicesStateTable />
				</div>
			</div>
		</div>
	);
}

export default DiagnosticCurrentState;
