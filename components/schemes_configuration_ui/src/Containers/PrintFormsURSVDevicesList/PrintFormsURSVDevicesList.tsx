import { Input } from '@evraz/ui-kit';

import Tree from '../../UI/Tree';

import usePrintFormsURSVDevicesList from './usePrintFormsURSVDevicesList';

import styles from './PrintFormsURSVDevicesList.module.css';
function PrintFormsURSVDevicesList() {
	const {
		handleSearchValueChange,
		activeNode,
		tree,
		searchValue,
		handleToggleNode,
		handleNodeClick,
	} = usePrintFormsURSVDevicesList();
	return (
		<div className={styles.tree}>
			<div className={styles.search_wrapper}>
				<Input
					onChange={handleSearchValueChange}
					value={searchValue}
					className={styles.search}
					placeholder="Введите № или наименование прибора..."
				/>
			</div>

			<Tree
				treeData={tree}
				onItemClick={handleNodeClick}
				onExpand={handleToggleNode}
				activeNode={activeNode}
				withExpand
			/>
		</div>
	);
}

export default PrintFormsURSVDevicesList;
