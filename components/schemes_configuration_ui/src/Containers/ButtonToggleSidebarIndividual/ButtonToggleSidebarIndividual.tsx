import { Button, Tooltip } from '@evraz/ui-kit';
import clsx from 'clsx';

import { TooltipDirection } from '../../Shared/types';
import { IconLayerSidebar } from '../../UI/Icon';

import { ButtonToggleSidebarIndividualProps } from './types';

import styles from './ButtonToggleSidebarIndividual.module.css';

function ButtonToggleSidebarIndividual({
	isSidebarOpen,
	onClick,
	className,
	style,
}: ButtonToggleSidebarIndividualProps) {
	const tooltipMessage = isSidebarOpen ? 'Скрыть дерево' : 'Показать дерево';

	return (
		<Tooltip tooltip={tooltipMessage} direction={TooltipDirection.Right}>
			<Button
				className={clsx('icon_button', styles.root, className)}
				style={style}
				onClick={onClick}
				key="sidebar"
			>
				<IconLayerSidebar />
			</Button>
		</Tooltip>
	);
}

export default ButtonToggleSidebarIndividual;
