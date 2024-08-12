import { useStore } from 'effector-react';

import { $user } from '../../../Models/Auth';
import {
	$printFormPositions,
	$selectedPrintFormTreeNode,
} from '../../../Models/PrintForms';
import { unsyncPrintFormPositionFx } from '../../../Models/PrintForms/effects';
import { PrintFormPosition } from '../../../Shared/types';
import { ModuleName } from '../../../Shared/Types/moduleName';

function useSelectedPointsUnsync() {
	const selectedPrintFormTreeNode = useStore($selectedPrintFormTreeNode);
	const printFormPositions = useStore($printFormPositions);
	const positionToUnsync: PrintFormPosition | undefined =
		printFormPositions.find(
			(position) => position.id === selectedPrintFormTreeNode?.positionId,
		);

	const user = useStore($user);

	const handleUnsync = () => {
		if (!selectedPrintFormTreeNode || !selectedPrintFormTreeNode.positionId) {
			return;
		}
		unsyncPrintFormPositionFx({
			nodeId: selectedPrintFormTreeNode.positionId,
			userId: user?.preferredUsername || '',
			moduleName: ModuleName.UseSelectedPointsUnsync_unsyncPrintFormPositionFx,
		});
	};

	return {
		nodeName: selectedPrintFormTreeNode?.nodeName,
		positionName: positionToUnsync?.name || '',
		handleUnsync,
	};
}

export default useSelectedPointsUnsync;
