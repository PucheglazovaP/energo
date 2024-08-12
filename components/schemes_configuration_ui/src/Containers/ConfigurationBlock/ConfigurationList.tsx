import { useEffect, useState } from 'react';
import { useStore } from 'effector-react';

import { $editMode, $selectedObjectsState } from '../../Models/EditMode';
import { setConfigTreeItemOpenState } from '../../Models/EditMode/events';
import { $formLayers } from '../../Models/FormLayers';
import Tree from '../../UI/Tree';
import { TreeItem } from '../../UI/Tree/types';
import { isAllElementsEqual } from '../../Utils/arrayTools';

import styles from './ConfigurationBlock.module.css';

function ConfigurationList() {
	const [isSelectedObjectsHasSameType, setSameTypeStatus] = useState(false);
	const { selectedObjects, isFormSelected } = useStore($selectedObjectsState);
	const { checkedFormLayers } = useStore($formLayers);
	const { selectedObjectConfig, formType } = useStore($editMode);
	const filteredSelectedObjects = selectedObjects.filter((item) =>
		checkedFormLayers.includes(item.layerId),
	);

	function onToggleNode(node: TreeItem) {
		if (isFormSelected)
			setConfigTreeItemOpenState({
				treeItem: node,
				type: formType,
			});
		if (filteredSelectedObjects.length > 0) {
			setConfigTreeItemOpenState({
				treeItem: node,
				type: filteredSelectedObjects[0].objectType,
			});
		}
	}

	useEffect(() => {
		if (isFormSelected) {
			setSameTypeStatus(true);
		} else {
			const selectedObjectsTypes: string[] = filteredSelectedObjects.map(
				(item) => String(item.objectType),
			);
			if (isAllElementsEqual(selectedObjectsTypes)) setSameTypeStatus(true);
			else setSameTypeStatus(false);
		}
	}, [filteredSelectedObjects, isFormSelected]);

	const treeHeight =
		selectedObjects.length > 1 ? 'calc(100% - 100px)' : 'calc(100% - 56px)';

	return (
		<>
			{selectedObjectConfig ? (
				isSelectedObjectsHasSameType ? (
					<Tree
						treeData={selectedObjectConfig}
						className={styles.tree}
						onExpand={onToggleNode}
						style={{ height: treeHeight }}
					/>
				) : null
			) : null}
		</>
	);
}

export default ConfigurationList;
