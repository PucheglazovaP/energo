import { useEffect, useMemo, useState } from 'react';
import { Checkbox, Select } from '@evraz/ui-kit';
import { SelectOption } from '@evraz/ui-kit/dist/src/Shared/Types/SelectCommonProps';
import { useStore } from 'effector-react';

import { NodeItemsActions } from '../../Const/Queries/nodeItems/types';
import { $user } from '../../Models/Auth';
import { closeModal } from '../../Models/Modal/events';
import { $nodeItems } from '../../Models/NodeItems';
import {
	getNodeItemsListFx,
	updateChannelNodeFx,
	updateEquipmentPieceNodeFx,
} from '../../Models/NodeItems/effects';
import { NSINodeItem } from '../../Models/NodeItems/types';
import {
	$nsiAvailableNodes,
	$nsiCurrentParentNode,
	$nsiItemsToMove,
	$nsiSelectedNode,
} from '../../Models/NSISelectedUnit';
import { RegisteredModals } from '../../Shared/modalsConfig';
import { User } from '../../Shared/types';
import { ModuleName } from '../../Shared/Types/moduleName';
import { TreeItem } from '../../UI/Tree/types';
import { toggleArrayValue } from '../../Utils/toggleArrayValue';

import styles from './ModalChangeNodeNSI.module.css';

function useChangeNodeNSI() {
	const user: User | null = useStore($user);
	const selectedNode: TreeItem | null = useStore($nsiSelectedNode);
	const availableNodes: TreeItem[] = useStore($nsiAvailableNodes);
	const itemsToMove: TreeItem[] = useStore($nsiItemsToMove);
	const currentNode: TreeItem | null = useStore($nsiCurrentParentNode);
	const nodeItems = useStore($nodeItems);

	const [newNode, setNewNode] = useState<string>('');
	const [checkedIds, setCheckedIds] = useState<number[]>([]);

	function handleSelectChange(option: SelectOption) {
		setNewNode(option.id);
	}

	function handleCheckboxToggle(id: number) {
		const newCheckedIds: number[] = toggleArrayValue(checkedIds.slice(), id);
		setCheckedIds(newCheckedIds);
	}

	function handleClose() {
		closeModal(RegisteredModals.ChangeNodeNSI);
	}
	async function handleConfirm() {
		if (user && selectedNode) {
			if (selectedNode.type === 'nsi_channel') {
				currentNodeItems.forEach(async (node: NSINodeItem) => {
					if (node.linkLastModified)
						await updateChannelNodeFx({
							userId: user.preferredUsername,
							linkId: node.linkId,
							linkLastModified: node.linkLastModified,
							newNodeId: Number(newNode),
							moduleName: ModuleName.UseChangeNodeNSI_updateChannelNodeFx,
						});
				});
			} else {
				currentNodeItems.forEach(async (node: NSINodeItem) => {
					if (node.linkLastModified)
						await updateEquipmentPieceNodeFx({
							userId: user.preferredUsername,
							linkId: node.linkId,
							linkLastModified: node.linkLastModified,
							newNodeId: Number(newNode),
							newChannelId: null,
							moduleName:
								ModuleName.UseChangeNodeNSI_updateEquipmentPieceNodeFx,
						});
				});
			}

			if (currentNode && newNode) {
				await getNodeItemsListFx({
					userId: user.preferredUsername,
					nodeId: currentNode.id,
					action: NodeItemsActions.Set,
					moduleName: ModuleName.UseChangeNodeNSI_getNodeItemsListFx,
				});
				await getNodeItemsListFx({
					userId: user.preferredUsername,
					nodeId: Number(newNode),
					action: NodeItemsActions.Set,
					moduleName: ModuleName.UseChangeNodeNSI_getNodeItemsListFx,
				});
			}

			handleClose();
		}
	}

	const currentNodeItems: NSINodeItem[] = useMemo(() => {
		return nodeItems.list.filter(({ id }) => checkedIds.includes(id));
	}, [nodeItems.list, checkedIds]);

	const newNodes: SelectOption[] = useMemo(() => {
		return availableNodes
			.filter(({ id }) => id !== currentNode?.id)
			.map((node: TreeItem) => ({
				name: node.displayName,
				id: String(node.id),
				isSelected: false,
			}));
	}, [currentNode, availableNodes]);

	const newNodesElement: JSX.Element = useMemo(
		() =>
			newNodes.length === 1 ? (
				<div className={styles.field_value}>{newNodes[0].name}</div>
			) : (
				<Select
					options={newNodes}
					onChange={handleSelectChange}
					value={newNode}
					className={styles.select}
				/>
			),
		[newNodes, newNode],
	);

	const checkboxesList: JSX.Element[] = useMemo(() => {
		return itemsToMove.map((item: TreeItem) => {
			const { id, displayName } = item;
			const isChecked = checkedIds.includes(id);
			function handleChange() {
				handleCheckboxToggle(id);
			}

			return (
				<div className={styles.checkbox_wrapper} key={id}>
					<Checkbox
						isChecked={isChecked}
						onChange={handleChange}
						className={styles.checkbox}
					/>
					<div className={styles.checkbox_caption}>{displayName}</div>
				</div>
			);
		});
	}, [itemsToMove, checkedIds]);

	const currentNodeName: string = currentNode?.displayName || '-';
	const currentNodeTitle: string = 'Текущий узел учета';
	const newNodeTitle: string = 'Новый узел учета';
	const checkboxTitle: string =
		selectedNode?.type === 'nsi_channel'
			? 'Каналы к переносу'
			: 'Единицы оборудования к переносу';

	const isChannelsWarningShown: boolean = selectedNode?.type === 'nsi_channel';
	const isConfirmButtonDisabled: boolean = checkedIds.length === 0 || !newNode;

	useEffect(() => {
		if (selectedNode) {
			setCheckedIds([selectedNode.id]);
		}
	}, [selectedNode]);

	useEffect(() => {
		if (!newNode && newNodes.length > 0) {
			setNewNode(newNodes[0].id);
		}
	}, [newNodes, newNode]);

	return {
		currentNodeName,
		newNodesElement,
		checkboxesList,
		checkboxTitle,
		isChannelsWarningShown,
		isConfirmButtonDisabled,
		currentNodeTitle,
		newNodeTitle,
		handleClose,
		handleConfirm,
	};
}

export default useChangeNodeNSI;
