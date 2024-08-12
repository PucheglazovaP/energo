import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { useStore } from 'effector-react';

import { $user } from '../../Models/Auth';
import { closeModal } from '../../Models/Modal/events';
import { $nodes } from '../../Models/Nodes';
import { createNodeFx, editNodeFx } from '../../Models/Nodes/effects';
import { NodesModel } from '../../Models/Nodes/types';
import { $nsiSelectedNode } from '../../Models/NSISelectedUnit';
import { RegisteredModals } from '../../Shared/modalsConfig';
import { User } from '../../Shared/types';
import { ModuleName } from '../../Shared/Types/moduleName';
import { TreeItem } from '../../UI/Tree/types';

function useCreateEditNodeNSI(isEditMode: boolean) {
	const user: User | null = useStore($user);
	const selectedNode: TreeItem | null = useStore($nsiSelectedNode);
	const nsiNodes: NodesModel = useStore($nodes);
	const [nodeName, setNodeName] = useState<string>('');

	const selectedItem = useMemo(() => {
		return nsiNodes.list.find(({ id }) => id === selectedNode?.id) || null;
	}, [nsiNodes.list, selectedNode?.id]);

	const isConfirmButtonDisabled: boolean =
		!nodeName || nodeName === selectedNode?.displayName;

	function handleNodeNameChange(evt: ChangeEvent<HTMLInputElement>) {
		const { value } = evt.target;
		setNodeName(value);
	}

	function handleClose() {
		if (isEditMode) {
			closeModal(RegisteredModals.EditNodeNSI);
		} else {
			closeModal(RegisteredModals.CreateNodeNSI);
		}
	}

	function handleConfirm() {
		if (user && nodeName && selectedNode) {
			if (isEditMode) {
				if (selectedItem)
					editNodeFx({
						userId: user.preferredUsername,
						nodeId: selectedNode.id,
						nodeName,
						lastModified: selectedItem.lastModified,
						moduleName: ModuleName.UseCreateEditNodeNSI_editNodeFx,
					});
			} else {
				createNodeFx({
					userId: user.preferredUsername,
					deviceId: selectedNode.id,
					nodeName,
					moduleName: ModuleName.UseCreateEditNodeNSI_createNodeFx,
				});
			}
			handleClose();
		}
	}

	useEffect(() => {
		if (isEditMode && selectedNode) {
			setNodeName(selectedNode.displayName);
		}
	}, [isEditMode, selectedNode]);

	return {
		nodeName,
		isConfirmButtonDisabled,
		handleNodeNameChange,
		handleClose,
		handleConfirm,
	};
}

export default useCreateEditNodeNSI;
