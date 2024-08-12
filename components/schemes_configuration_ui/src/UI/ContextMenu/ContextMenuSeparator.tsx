import { SeparatorProps } from './types';

import styles from './ContextMenu.module.css';

function ContextMenuSeparator(props: SeparatorProps) {
	const { name } = props;

	return (
		<div className={styles.separator}>
			{name && <span className={styles.separator_name}>{name}</span>}
			<span className={styles.separator_line} />
		</div>
	);
}

export default ContextMenuSeparator;
