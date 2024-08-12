import { DeviceHealthinessHeaderProps } from './types';

import styles from './DeviceHealthiness.module.css';

function DeviceHealthinessHeader(props: DeviceHealthinessHeaderProps) {
	const { children } = props;
	return <div className={styles.table_header}>{children}</div>;
}

export default DeviceHealthinessHeader;
