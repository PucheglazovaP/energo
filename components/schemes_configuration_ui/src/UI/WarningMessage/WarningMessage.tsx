import CircleInfo from '../../Icons/CircleInfo';

import { WarningMessageProps } from './types';

import styles from './WarningMessage.module.css';

function WarningMessage({ className, text }: WarningMessageProps) {
	return (
		<div className={`${styles.container} ${className || ''}`}>
			<CircleInfo width={20} height={20} className={styles.icon} />
			{text}
		</div>
	);
}

export default WarningMessage;
