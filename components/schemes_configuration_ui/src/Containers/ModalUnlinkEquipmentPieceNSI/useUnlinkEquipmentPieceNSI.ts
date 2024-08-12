import { useMemo } from 'react';
import { useStore } from 'effector-react';

import { NodeItemsActions } from '../../Const/Queries/nodeItems/types';
import { $user } from '../../Models/Auth';
import { closeModal } from '../../Models/Modal/events';
import { $nodeItems } from '../../Models/NodeItems';
import {
	getNodeItemsListFx,
	updateEquipmentPieceNodeFx,
} from '../../Models/NodeItems/effects';
import { NSINodeItem } from '../../Models/NodeItems/types';
import {
	$nsiCurrentParentNode,
	$nsiParentChannel,
	$nsiSelectedNode,
} from '../../Models/NSISelectedUnit';
import { RegisteredModals } from '../../Shared/modalsConfig';
import { User } from '../../Shared/types';
import { ModuleName } from '../../Shared/Types/moduleName';
import { TreeItem } from '../../UI/Tree/types';

function useUnlinkEquipmentPieceNSI() {
	const user: User | null = useStore($user);
	const parentChannel: TreeItem | null = useStore($nsiParentChannel);
	const currentNode: TreeItem | null = useStore($nsiCurrentParentNode);
	const selectedNode: TreeItem | null = useStore($nsiSelectedNode);
	const nodeItems = useStore($nodeItems);

	const selectedEquipmentPiece: NSINodeItem | null = useMemo(() => {
		return nodeItems.list.find(({ id }) => id === selectedNode?.id) || null;
	}, [selectedNode, nodeItems]);

	const newNodeChannelName: string = parentChannel
		? `канала ${parentChannel.displayName}`
		: `узла учета ${currentNode?.displayName || ''}`;
	const title: string = `Вы уверены, что хотите отвязать единицу оборудования ${
		selectedNode?.displayName || '-'
	} от ${newNodeChannelName}?`;

	function handleClose() {
		closeModal(RegisteredModals.UnlinkEquipmentNSI);
	}
	function handleConfirm() {
		if (user && currentNode && selectedEquipmentPiece?.linkLastModified) {
			updateEquipmentPieceNodeFx({
				userId: user.preferredUsername,
				newNodeId: null,
				newChannelId: null,
				linkId: selectedEquipmentPiece.linkId,
				linkLastModified: selectedEquipmentPiece.linkLastModified,
				moduleName:
					ModuleName.UseUnlinkEquipmentPieceNSI_updateEquipmentPieceNodeFx,
			});

			getNodeItemsListFx({
				userId: user.preferredUsername,
				nodeId: currentNode.id,
				action: NodeItemsActions.Set,
				moduleName: ModuleName.UseUnlinkEquipmentPieceNSI_getNodeItemsListFx,
			});

			handleClose();
		}
	}

	return { title, handleClose, handleConfirm };
}

export default useUnlinkEquipmentPieceNSI;
