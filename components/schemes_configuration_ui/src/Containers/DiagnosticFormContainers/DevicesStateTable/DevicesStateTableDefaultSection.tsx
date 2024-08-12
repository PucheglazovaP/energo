import { DevicesStateTableDefaultSectionProps } from './types';

import styles from './DevicesStateTable.module.css';

function DevicesStateTableDefaultSection({
	title,
}: DevicesStateTableDefaultSectionProps) {
	return <div className={styles.section_render}>{title}</div>;
}

export default DevicesStateTableDefaultSection;
