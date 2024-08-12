import { Button } from '@evraz/ui-kit';
import clsx from 'clsx';

import { Plus } from '../../Icons';
import ContextMenu from '../../UI/ContextMenu';
import Table from '../../UI/Table';

import { useVisualizationGroups } from './useVisualizationGroups';

import styles from './VisualizationGroups.module.css';

function VisualizationGroups() {
	const {
		header,
		visualizationGroupsData,
		onDragEnd,
		position,
		setPosition,
		items,
		onCancel,
		onConfirm,
		onAddGroup,
	} = useVisualizationGroups();

	return (
		<>
			<div className={styles.visualization_groups}>
				<Table
					headers={header}
					data={visualizationGroupsData}
					onDragEnd={onDragEnd}
					isDraggable
					droppableId="table-visualization-groups"
					className={clsx(
						styles.visualization_groups_table,
						styles.footer_height,
					)}
				/>
				<div className={styles.bottom_buttons}>
					<Button onClick={onCancel}>Отменить</Button>
					<div className={styles.additional_buttons}>
						<Button onClick={onAddGroup} className={styles.button_add}>
							<Plus className={styles.icon_plus} /> Добавить группу
						</Button>
						<Button onClick={onConfirm} primary className={styles.button_apply}>
							Применить
						</Button>
					</div>
				</div>
			</div>
			<ContextMenu
				items={items}
				position={position}
				setPosition={setPosition}
			/>
		</>
	);
}

export default VisualizationGroups;
