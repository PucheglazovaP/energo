import { useStore } from 'effector-react';

import { $user } from '../../../Models/Auth';
import {
	$printFormPositions,
	$selectedPrintFormPositionId,
	$selectedPrintFormTreeNode,
} from '../../../Models/PrintForms';
import { syncPrintFormPositionFx } from '../../../Models/PrintForms/effects';
import { PrintFormPosition } from '../../../Shared/types';
import { ModuleName } from '../../../Shared/Types/moduleName';

function useSelectedPointsSync() {
	const selectedPrintFormTreeNode = useStore($selectedPrintFormTreeNode);
	const selectedPrintFormPositionId = useStore($selectedPrintFormPositionId);
	const printFormPositions = useStore($printFormPositions);
	const user = useStore($user);

	const positionToSync: PrintFormPosition | undefined = printFormPositions.find(
		(position) => position.id === selectedPrintFormPositionId,
	);

	const handleSync = () => {
		if (!selectedPrintFormTreeNode || !positionToSync) {
			return;
		}
		syncPrintFormPositionFx({
			printReportItemId: positionToSync.id,
			reportItemId: selectedPrintFormTreeNode.nodeId,
			userId: user?.preferredUsername || '',
			moduleName: ModuleName.UseSelectedPointsSync_syncPrintFormPositionFx,
		});
	};

	return {
		nodeName: selectedPrintFormTreeNode?.nodeName,
		positionName: positionToSync?.name || '',
		handleSync,
	};
}

export default useSelectedPointsSync;
