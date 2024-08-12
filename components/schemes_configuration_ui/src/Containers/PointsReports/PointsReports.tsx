import ContextMenu from '../../UI/ContextMenu';
import Table from '../../UI/Table';

import { usePointsReports } from './usePointsReports';

import styles from './PointsReports.module.css';

function PointsReports() {
	const { header, pointsData, onDragEnd, position, setPosition, items } =
		usePointsReports();

	return (
		<>
			<div className={styles.body}>
				<Table
					headers={header}
					data={pointsData}
					onDragEnd={onDragEnd}
					isDraggable
					droppableId="table-points"
					className={styles.table_points}
				/>
			</div>
			<ContextMenu
				items={items}
				position={position}
				setPosition={setPosition}
			/>
		</>
	);
}

export default PointsReports;
