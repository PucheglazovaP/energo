import { DeviceHealthinessHighlightCellProps } from './types';

import styles from './DeviceHealthiness.module.css';

function DeviceHealthinessHighlightCell(
	props: DeviceHealthinessHighlightCellProps,
) {
	const { backgroundColor, text } = props;
	return (
		<span className={styles.device_highlight} style={{ backgroundColor }}>
			{text}
		</span>
	);
}

export default DeviceHealthinessHighlightCell;
