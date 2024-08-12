import { Button, Tooltip } from '@evraz/ui-kit';
import { ButtonProps } from '@evraz/ui-kit/dist/src/components/Button/types';
import clsx from 'clsx';
import { useStore } from 'effector-react';

import { $sidebar } from '../../Models/Sidebar';
import { setOpenFlag } from '../../Models/Sidebar/events';
import { TooltipDirection } from '../../Shared/types';
import { IconLayerSidebar } from '../../UI/Icon';

import styles from './ButtonToggleSideBar.module.css';

function ButtonToggleSideBar({ className, style, primary }: ButtonProps) {
	const sidebar = useStore($sidebar);

	const toggleSidebarOpenFlag = () => setOpenFlag(!sidebar.isOpen);
	const tooltipMessage = sidebar.isOpen ? 'Скрыть дерево' : 'Показать дерево';
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
				onClick={toggleSidebarOpenFlag}
				disabled={sidebar.isDisabled}
				key="sidebar"
			>
				<IconLayerSidebar />
			</Button>
		</Tooltip>
	);
}

export default ButtonToggleSideBar;
