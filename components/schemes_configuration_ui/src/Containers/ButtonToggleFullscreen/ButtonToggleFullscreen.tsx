import { Button, OtherMaximize, Tooltip } from '@evraz/ui-kit';
import { ButtonProps } from '@evraz/ui-kit/dist/src/components/Button/types';
import clsx from 'clsx';
import { useStore } from 'effector-react';

import { $activeForm } from '../../Models/ActiveForm';
import { setFullScreenMode } from '../../Models/ActiveForm/events';
import { TooltipDirection } from '../../Shared/types';

import styles from './ButtonToggleFullscreen.module.css';

function ButtonToggleFullscreen({ className, style, primary }: ButtonProps) {
	const { isFullScreenModeEnabled } = useStore($activeForm);

	const toggleOpenFlag = () => {
		if (isFullScreenModeEnabled && document.exitFullscreen)
			document.exitFullscreen();
		else document.documentElement.requestFullscreen();
		setFullScreenMode(!isFullScreenModeEnabled);
	};
	const tooltipMessage = isFullScreenModeEnabled
		? 'Отключить полноэкранный режим'
		: 'Полноэкранный режим';
	return (
		<Tooltip
			tooltip={tooltipMessage}
			direction={TooltipDirection.Right}
			className={styles.tooltip}
		>
			<Button
				className={clsx('icon_button', styles.btn, className)}
				style={style}
				primary={primary}
				onClick={toggleOpenFlag}
				key="fullscreen"
			>
				<OtherMaximize className={styles.icon} />
			</Button>
		</Tooltip>
	);
}

export default ButtonToggleFullscreen;
