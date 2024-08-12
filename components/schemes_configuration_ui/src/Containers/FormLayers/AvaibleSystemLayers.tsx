import { Button } from '@evraz/ui-kit';

import { Plus } from '../../Icons';
import ContextMenu from '../../UI/ContextMenu';
import Table from '../../UI/Table';

import useAvaibleSystemLayers from './useAvaibleSystemLayers';

import styles from './FormLayers.module.css';

function AvaibleSystemLayers() {
	const {
		handleCreateLayer,
		header,
		tableData,
		contextMenuItems,
		position,
		setPosition,
		isLoading,
	} = useAvaibleSystemLayers();
	return (
		<div className={styles.avaible_layers}>
			<div className={styles.header}>
				<div className={styles.header_title}>Доступные слои системы</div>
				<Button className={styles.add_button} onClick={handleCreateLayer}>
					<Plus className={styles.plus} />
					<span>Добавить</span>
				</Button>
			</div>
			<Table
				headers={header}
				data={tableData}
				className={styles.table}
				isLoading={isLoading}
			/>
			<ContextMenu
				items={contextMenuItems}
				position={position}
				setPosition={setPosition}
			/>
		</div>
	);
}

export default AvaibleSystemLayers;
