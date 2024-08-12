import { useStore } from 'effector-react';

import { $user } from '../../Models/Auth';
import { closeModal } from '../../Models/Modal/events';
import { deleteNodeFx } from '../../Models/Nodes/effects';
import { $nsiSelectedNode } from '../../Models/NSISelectedUnit';
import { RegisteredModals } from '../../Shared/modalsConfig';
import { User } from '../../Shared/types';
import { ModuleName } from '../../Shared/Types/moduleName';
import { TreeItem } from '../../UI/Tree/types';

function useDeleteNodeNSI() {
	const user: User | null = useStore($user);
	const selectedNode: TreeItem | null = useStore($nsiSelectedNode);

	const title: string = `Вы действительно хотите удалить узел учета ${
		selectedNode?.displayName || ''
	}?`;

	function handleClose() {
		closeModal(RegisteredModals.DeleteNodeNSI);
	}

	function handleConfirm() {
		if (user && selectedNode) {
			deleteNodeFx({
				userId: user.preferredUsername,
				nodeId: selectedNode.id,
				moduleName: ModuleName.UseDeleteNodeNSI_deleteNodeFx,
			});
			handleClose();
		}
	}

	return {
		handleConfirm,
		handleClose,
		title,
	};
}

export default useDeleteNodeNSI;
