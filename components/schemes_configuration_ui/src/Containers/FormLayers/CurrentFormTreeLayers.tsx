import ContextMenu from '../../UI/ContextMenu';
import Tree from '../../UI/Tree';

import useCurrentFormTreeLayers from './useCurrentFormTreeLayers';

import styles from './FormLayers.module.css';

function CurrentFormTreeLayers() {
	const {
		treeData,
		contextMenuItems,
		position,
		activeFormLayerId,
		setPosition,
		handleItemClick,
		handleOpenContextMenu,
	} = useCurrentFormTreeLayers();

	return (
		<div className={styles.current_form_layers}>
			<div className={styles.header}>
				<div className={styles.header_title}>Дерево слоев текущей формы</div>
			</div>
			<Tree
				onItemClick={handleItemClick}
				onContextMenu={handleOpenContextMenu}
				treeData={treeData}
				className={styles.tree}
				activeNode={{ id: activeFormLayerId || undefined, type: 'node' }}
				needSort
			/>

			<ContextMenu
				items={contextMenuItems}
				position={position}
				setPosition={setPosition}
				className={styles.context_menu}
			/>
		</div>
	);
}

export default CurrentFormTreeLayers;
