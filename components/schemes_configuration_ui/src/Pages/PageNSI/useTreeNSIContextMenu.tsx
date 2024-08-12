import { MouseEvent, useEffect, useMemo, useState } from 'react';
import { useStore } from 'effector-react';

import { NodeItemsActions } from '../../Const/Queries/nodeItems/types';
import { TabName } from '../../Containers/NSIInformationPanel/types';
import { Crosshair } from '../../Icons';
import LinkOn from '../../Icons/LinkOn';
import { $user } from '../../Models/Auth';
import { getNodeItemsListFx } from '../../Models/NodeItems/effects';
import { getMeasuringInstrumentsListFx } from '../../Models/NSIMeasuringInstruments/effects';
import {
	clearExtendedFilter,
	clearSearchValues,
	setSelectedRow,
} from '../../Models/NSIMeasuringInstruments/events';
import {
	$nsiCurrentParentChannelId,
	$nsiParentChannel,
	$nsiSelectedNode,
} from '../../Models/NSISelectedUnit';
import {
	setAvailableChannels,
	setAvailableNodes,
	setCurrentParentChannelId,
	setCurrentParentNode,
	setItemsToMove,
	setNsiSelectedTab,
	setParentChannel,
	setSelectedNode,
} from '../../Models/NSISelectedUnit/events';
import { $nsiTreeDevices } from '../../Models/NSITreeDevices';
import { Permissions } from '../../packages/KeycloakInstance/types';
import usePermissions from '../../packages/KeycloakInstance/usePermissions';
import { checkPermission } from '../../packages/KeycloakInstance/utils';
import { ModuleName } from '../../Shared/Types/moduleName';
import {
	ContextMenuItem,
	ContextMenuPosition,
} from '../../UI/ContextMenu/types';
import { TreeItem } from '../../UI/Tree/types';

import {
	addNodeContextMenuItem,
	changeChannelEquipmentNodeContextMenuItem,
	deleteNodeContextMenuItem,
	editNodeContextMenuItem,
	nodeTypesForContextMenu,
	unlinkEquipmentContextMenuItem,
} from './constants';
import {
	getAvailableChannelsForEquipment,
	getAvailableNodes,
	getChannelsToMove,
	getEquipmentParentChannel,
	getEquipmentsToLink,
	getParent,
	getParentId,
	handleOpenLinkEquipmentToChannelModal,
} from './utils';

function useTreeNSIContextMenu() {
	const user = useStore($user);
	const selectedNode: TreeItem | null = useStore($nsiSelectedNode);
	const tree: TreeItem[] = useStore($nsiTreeDevices);
	const currentParentChannelId: number | null = useStore(
		$nsiCurrentParentChannelId,
	);
	const parentChannel: TreeItem | null = useStore($nsiParentChannel);
	const permissions = usePermissions();
	const hasNSIEditingPermission: boolean = checkPermission(
		permissions,
		Permissions.CanEditNSIPage,
	);
	const [position, setPosition] = useState<ContextMenuPosition | null>(null);
	const [isNodeEmpty, setIsNodeEmpty] = useState<boolean>(false);

	const handleTreeItemsContextMenu = (evt: MouseEvent, treeItem: TreeItem) => {
		const { type, parentId } = treeItem;
		const isContextMenuShown: boolean =
			!!type &&
			nodeTypesForContextMenu.includes(type) &&
			(hasNSIEditingPermission || type === 'equipment_piece');

		if (isContextMenuShown) {
			setSelectedNode(treeItem);
			if (type === 'nsi_channel' || type === 'equipment_piece') {
				if (parentId) {
					const parentNode: TreeItem | null = getParent(tree, treeItem, 'node');
					const availableNodes: TreeItem[] = getAvailableNodes(tree, treeItem);

					setAvailableNodes(availableNodes);
					setCurrentParentNode(parentNode);

					if (type === 'equipment_piece') {
						const parentChannelId: number | null = getParentId(
							tree,
							treeItem,
							'nsi_channel',
						);
						const parentChannel: TreeItem | null = getEquipmentParentChannel(
							tree,
							treeItem,
						);
						const availableChannels: TreeItem[] =
							getAvailableChannelsForEquipment(tree, treeItem);
						const availableEquipmentPieces: TreeItem[] = getEquipmentsToLink(
							tree,
							treeItem,
						);

						setCurrentParentChannelId(parentChannelId);
						setParentChannel(parentChannel);
						setAvailableChannels(availableChannels);
						setItemsToMove(availableEquipmentPieces);
					} else {
						if (availableNodes.length < 2) {
							setPosition(null);
							return;
						}

						const availableChannelsToMove: TreeItem[] = getChannelsToMove(
							tree,
							treeItem,
						);
						setItemsToMove(availableChannelsToMove);
					}
				} else {
					setPosition(null);
					return;
				}
			}
			evt.preventDefault();
			setPosition({
				x: evt.pageX,
				y: evt.pageY,
			});
		} else {
			setPosition(null);
			return;
		}
	};
	const handleFindEquipmentInJournal = () => {
		if (user && selectedNode?.itemNumber) {
			setNsiSelectedTab(TabName.MEASURING_INSTRUMENTS_JOURNAL);
			setSelectedRow(`${selectedNode.itemNumber}`);
			clearSearchValues();
			clearExtendedFilter();
			getMeasuringInstrumentsListFx({
				action: 'set',
				measurementTypeCode: null,
				equipmentShortName: null,
				manufacturerTypeName: null,
				productionYear: null,
				factoryNumber: null,
				userStatusCode: null,
				equipmentNumber: selectedNode.itemNumber,
				location: null,
				pageRowCount: 20,
				pageNumber: 1,
				firstRow: 0,
				selectRow: null,
				pageTotalCount: 0,
				userId: user.preferredUsername,
				moduleName:
					ModuleName.UseTreeNSIContextMenu_getMeasuringInstrumentsListFx,
			});
		}
	};
	const linkEquipmentToChannelContextMenuItem: ContextMenuItem = {
		name: parentChannel ? 'Сменить привязку' : 'Привязать к каналу',
		onClick: handleOpenLinkEquipmentToChannelModal,
		renderFn: () => (
			<div className={'context_menu_item'}>
				<LinkOn className={'context_menu_icon'} />
				<span>{parentChannel ? 'Сменить привязку' : 'Привязать к каналу'}</span>
			</div>
		),
	};
	const findEquipmentInJournalContextMenuItem: ContextMenuItem = {
		name: 'Найти в Журнале СИ',
		onClick: handleFindEquipmentInJournal,
		renderFn: () => (
			<div className={'context_menu_item'}>
				<Crosshair className={'context_menu_icon'} />
				<span>Найти в Журнале СИ</span>
			</div>
		),
	};
	const contextMenuItems: ContextMenuItem[] = useMemo(() => {
		if (selectedNode) {
			switch (selectedNode.type) {
				case 'device':
					return [addNodeContextMenuItem];
				case 'node':
					return isNodeEmpty
						? [editNodeContextMenuItem, deleteNodeContextMenuItem]
						: [editNodeContextMenuItem];
				case 'nsi_channel':
					return [changeChannelEquipmentNodeContextMenuItem];
				case 'equipment_piece':
					return hasNSIEditingPermission
						? currentParentChannelId
							? [
									findEquipmentInJournalContextMenuItem,
									unlinkEquipmentContextMenuItem,
							  ]
							: parentChannel
							? [
									findEquipmentInJournalContextMenuItem,
									linkEquipmentToChannelContextMenuItem,
							  ]
							: [
									findEquipmentInJournalContextMenuItem,
									changeChannelEquipmentNodeContextMenuItem,
									linkEquipmentToChannelContextMenuItem,
									unlinkEquipmentContextMenuItem,
							  ]
						: [findEquipmentInJournalContextMenuItem];

				default:
					return [];
			}
		}
		return [];
	}, [selectedNode, parentChannel, isNodeEmpty]);

	async function checkIsNodeEmpty() {
		if (selectedNode && user && selectedNode.type === 'node') {
			const nodes = await getNodeItemsListFx({
				nodeId: selectedNode.id,
				action: NodeItemsActions.None,
				userId: user.preferredUsername,
				moduleName: ModuleName.UseTreeNSIContextMenu_getNodeItemsListFx,
			});

			setIsNodeEmpty(!nodes.length);
		}
	}

	useEffect(() => {
		checkIsNodeEmpty();
	}, [selectedNode, user]);

	return {
		handleTreeItemsContextMenu,
		contextMenuItems,
		position,
		setPosition,
	};
}

export default useTreeNSIContextMenu;
