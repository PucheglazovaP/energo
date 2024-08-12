import Table from '../../UI/Table';

import useDevicesTable from './useDevicesTable';

import styles from './DeviceHealthiness.module.css';

function DeviceHealthiness() {
	const { isLoading, headers, devices, handleExpand } = useDevicesTable();

	return (
		<div className={styles.healthiness}>
			<Table
				headers={headers}
				data={devices}
				isLoading={isLoading}
				handleExpandCollapse={handleExpand}
				className={styles.healthiness_table}
			/>
		</div>
	);
}

export default DeviceHealthiness;
