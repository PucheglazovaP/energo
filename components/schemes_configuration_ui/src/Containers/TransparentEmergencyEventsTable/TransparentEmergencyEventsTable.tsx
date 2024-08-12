import ContextMenu from '../../UI/ContextMenu';
import Spinner from '../../UI/Spinner';
import Table from '../../UI/Table';

import useEmergencyEventsTable from './useEmergencyEventsTable';

import styles from './TransparentEmergencyEventsTable.module.css';

function TransparentEmergencyEventsTable() {
	const {
		tableData,
		header,
		isLoading,
		position,
		сontextMenuItems,
		setPosition,
	} = useEmergencyEventsTable();

	return (
		<>
			<div className={styles.container}>
				{!isLoading ? (
					<div className={styles.table}>
						<Table headers={header} data={tableData} className={styles.table} />
					</div>
				) : (
					<Spinner className={styles.spinner} />
				)}
				<ContextMenu
					items={сontextMenuItems}
					position={position}
					setPosition={setPosition}
				/>
			</div>
		</>
	);
}

export default TransparentEmergencyEventsTable;
