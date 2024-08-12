import clsx from 'clsx';

import ContextMenu from '../../UI/ContextMenu';
import Table from '../../UI/Table';

import { TableAssignedEmergencyEventsProps } from './types';
import useTableAssignedEmergencyEvents from './useTableAssignedEmergencyEvents';

import styles from './TableAssignedEmergencyEvents.module.css';

function TableAssignedEmergencyEvents({
	className,
	style,
}: TableAssignedEmergencyEventsProps) {
	const {
		header,
		data,
		isLoading,
		contextMenuItems,
		position,
		activePosition,
		setPosition,
	} = useTableAssignedEmergencyEvents();
	return (
		<div className={clsx(styles.root, className)} style={style}>
			<Table
				headers={header}
				data={data}
				className={styles.table}
				isLoading={isLoading}
				activeIndex={activePosition}
			/>
			<ContextMenu
				items={contextMenuItems}
				position={position}
				setPosition={setPosition}
			/>
		</div>
	);
}

export default TableAssignedEmergencyEvents;
