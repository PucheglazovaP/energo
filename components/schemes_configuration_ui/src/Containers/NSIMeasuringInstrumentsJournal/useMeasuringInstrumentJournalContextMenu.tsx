import { MouseEvent, useEffect, useMemo, useState } from 'react';
import { useStore } from 'effector-react';

import { NodeItemsActions } from '../../Const/Queries/nodeItems/types';
import { Crosshair } from '../../Icons';
import { $user } from '../../Models/Auth';
import { getDevicesListFx } from '../../Models/Devices/effects';
import { openDeviceById } from '../../Models/Devices/events';
import { getNodeItemsListFx } from '../../Models/NodeItems/effects';
import { openNodeItemNode } from '../../Models/NodeItems/events';
import { getNodesListFx } from '../../Models/Nodes/effects';
import { openNodeById } from '../../Models/Nodes/events';
import {
	$currentNodeId,
	$nsiMeasuringInstruments,
	$selectedRow,
} from '../../Models/NSIMeasuringInstruments';
import { getDeviceByEquipmentNumberFx } from '../../Models/NSIMeasuringInstruments/effects';
import {
	setCurrentDeviceId,
	setCurrentNodeId,
	setSelectedRow,
} from '../../Models/NSIMeasuringInstruments/events';
import { $nsiTreeDevices } from '../../Models/NSITreeDevices';
import { User } from '../../Shared/types';
import { ModuleName } from '../../Shared/Types/moduleName';
import {
	ContextMenuItem,
	ContextMenuPosition,
} from '../../UI/ContextMenu/types';
import { TreeItem } from '../../UI/Tree/types';

function useMeasuringInstrumentJournalContextMenu() {
	const user: User | null = useStore($user);
	const selectedRow: string = useStore($selectedRow);
	const { instrumentsList } = useStore($nsiMeasuringInstruments);
	const tree: TreeItem[] = useStore($nsiTreeDevices);
	const currentNodeId: number | null = useStore($currentNodeId);

	const [position, setPosition] = useState<ContextMenuPosition | null>(null);

	function handleEquipmentContextMenu(
		evt: MouseEvent,
		equipmentNumberValue: string,
	) {
		const instrument = instrumentsList.find(
			({ equipmentNumber }) => equipmentNumber === equipmentNumberValue,
		);

		if (instrument && instrument.linkedToUnit) {
			evt.preventDefault();
			setPosition({
				x: evt.pageX,
				y: evt.pageY,
			});
			setSelectedRow(equipmentNumberValue);
		}
	}

	function handleFindEquipmentInTree() {
		if (user && selectedRow) {
			getDeviceByEquipmentNumberFx({
				userId: user.preferredUsername,
				equipmentNumber: selectedRow,
				moduleName:
					ModuleName.UseMeasuringInstrumentJournalContextMenu_getDeviceByEquipmentNumberFx,
			}).then(({ deviceId, nodeId }) => {
				if (deviceId && nodeId) {
					setCurrentDeviceId(deviceId);
					setCurrentNodeId(nodeId);

					Promise.allSettled([
						getDevicesListFx({
							filterMode: 1,
							filterStr: String(deviceId),
							userId: user.preferredUsername,
						}),
						getNodesListFx({
							deviceId,
							action: 'set',
							userId: user.preferredUsername,
							moduleName:
								ModuleName.UseMeasuringInstrumentJournalContextMenu_getNodesListFx,
						}),
						getNodeItemsListFx({
							nodeId,
							action: NodeItemsActions.Set,
							userId: user.preferredUsername,
							moduleName:
								ModuleName.UseMeasuringInstrumentJournalContextMenu_getNodeItemsListFx,
						}),
					]).then(() => {
						openDeviceById(deviceId);
						openNodeById(nodeId);
					});
				}
			});
		}
	}

	const equipmentsFolder = useMemo(
		() =>
			tree.find(
				({ parentId, parentType }) =>
					parentId === currentNodeId && parentType === 'node',
			),
		[tree, currentNodeId],
	);

	const contextMenuItems: ContextMenuItem[] = [
		{
			name: 'Найти в в дереве приборов',
			onClick: handleFindEquipmentInTree,
			renderFn: () => (
				<div className={'context_menu_item'}>
					<Crosshair className={'context_menu_icon'} />
					<span>Найти в в дереве приборов</span>
				</div>
			),
		},
	];

	useEffect(() => {
		if (equipmentsFolder && !equipmentsFolder.isOpen) {
			openNodeItemNode(equipmentsFolder);
		}
	}, [tree, equipmentsFolder]);

	return {
		position,
		contextMenuItems,
		setPosition,
		handleEquipmentContextMenu,
	};
}

export default useMeasuringInstrumentJournalContextMenu;
