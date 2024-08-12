import { Button, NotificationOn } from '@evraz/ui-kit';
import clsx from 'clsx';

import { ButtonEmergencyConfirmationProps } from './types';
import useEmergencyConfirmation from './useEmergencyConfirmation';

import styles from './ButtonEmergencyConfirmation.module.css';

function ButtonEmergencyConfirmation({
	className,
	style,
}: ButtonEmergencyConfirmationProps) {
	const { hasEmergencyConfirmRole, hasEmergencyEvents, handleButtonClick } =
		useEmergencyConfirmation();

	if (!hasEmergencyConfirmRole) {
		return null;
	}

	return (
		<Button
			className={clsx(styles.root, styles.button, className, {
				[styles.button__active]: hasEmergencyEvents,
			})}
			style={style}
			onClick={handleButtonClick}
		>
			<NotificationOn className={clsx(styles.icon)} />
		</Button>
	);
}

export default ButtonEmergencyConfirmation;
