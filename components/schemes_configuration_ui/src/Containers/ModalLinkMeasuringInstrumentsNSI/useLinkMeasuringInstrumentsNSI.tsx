import { useEffect, useMemo, useState } from 'react';
import { Button, Select } from '@evraz/ui-kit';
import { SelectOption } from '@evraz/ui-kit/dist/src/Shared/Types/SelectCommonProps';
import { useStore } from 'effector-react';

import { NodeItemsActions } from '../../Const/Queries/nodeItems/types';
import { Close } from '../../Icons';
import { $user } from '../../Models/Auth';
import { closeModal } from '../../Models/Modal/events';
import { $navigation } from '../../Models/Navigation';
import {
	getNodeItemsListFx,
	linkEquipmentPieceFx,
} from '../../Models/NodeItems/effects';
import { $nsiMeasuringInstruments } from '../../Models/NSIMeasuringInstruments';
import { getMeasuringInstrumentsListFx } from '../../Models/NSIMeasuringInstruments/effects';
import { changeInstrumentCheckedState } from '../../Models/NSIMeasuringInstruments/events';
import { NSIMeasuringInstrument } from '../../Models/NSIMeasuringInstruments/types';
import { $nsiTreeDevices } from '../../Models/NSITreeDevices';
import { RegisteredModals } from '../../Shared/modalsConfig';
import { ModuleName } from '../../Shared/Types/moduleName';
import { ITableBody, ITableColumn } from '../../UI/Table/types';
import WarningMessage from '../../UI/WarningMessage';

import styles from './ModalLinkMeasuringInstrumentsNSI.module.css';

function useLinkMeasuringInstrumentsNSI() {
	const user = useStore($user);
	const { deviceId, nodeItemId, nodeId } = useStore($navigation);
	const tree = useStore($nsiTreeDevices);
	const { instrumentsList } = useStore($nsiMeasuringInstruments);
	const [selectedNodeId, setSelectedNodeId] = useState<string | undefined>();
	const [selectedFolderId, setSelectedFolderId] = useState<
		string | undefined
	>();
	const [selectedChannelId, setSelectedChannelId] = useState<
		string | undefined
	>();
	const checkedInstruments: NSIMeasuringInstrument[] = useMemo(
		() => instrumentsList.filter(({ checked }) => checked),
		[instrumentsList],
	);
	const handleEquipmentRemove =
		(equipmentNumber: string, factoryNumber: string) => () => {
			changeInstrumentCheckedState({ equipmentNumber, factoryNumber });
		};
	const header: ITableColumn[] = [
		{
			accessor: 'equipmentShortName',
			text: 'Наименование СИ',
			sortOrder: 0,
			isSortable: false,
		},
		{
			accessor: 'manufacturerTypeName',
			text: 'Тип (марка)',
			sortOrder: 0,
		},
		{
			accessor: 'precisionClass',
			text: 'Класс точности',
			sortOrder: 0,
		},
		{
			accessor: 'factoryNumber',
			text: 'Заводской (инвентарный номер)',
			sortOrder: 0,
		},
		{
			accessor: 'removeEquipment',
			text: ' ',
			sortOrder: 0,
		},
	];
	const data: ITableBody[] = checkedInstruments.map(
		(instrument: NSIMeasuringInstrument) => ({
			dataLine: [
				{
					accessor: 'equipmentShortName',
					text: instrument.equipmentShortName,
				},
				{
					accessor: 'manufacturerTypeName',
					text: instrument.manufacturerTypeName,
				},
				{
					accessor: 'precisionClass',
					text: instrument.precisionClass,
				},
				{
					accessor: 'factoryNumber',
					text: instrument.factoryNumber,
				},
				{
					accessor: 'removeEquipment',
					text: '',
					renderCell: () => (
						<Button
							className={styles.remove_equipment_button}
							onClick={handleEquipmentRemove(
								instrument.equipmentNumber,
								instrument.factoryNumber,
							)}
						>
							<Close className={styles.remove_equipment_button_icon} />
						</Button>
					),
				},
			],
		}),
	);

	const currentDevice = useMemo(
		() =>
			tree.find(({ id, type }) => id === deviceId && type === 'device') || null,
		[tree, deviceId],
	);
	const nodes = useMemo(
		() =>
			tree.filter(
				({ parentId, parentType }) =>
					parentId === deviceId && parentType === 'device',
			),
		[tree, deviceId],
	);
	const folders = useMemo(() => {
		const foldersList = tree.filter(({ parentId, parentType }) => {
			return String(parentId) === selectedNodeId && parentType === 'node';
		});

		if (!foldersList.some(({ type }) => type === 'equipment_pieces')) {
			foldersList.unshift({
				id: 0,
				name: 'Единицы оборудования',
				displayName: 'Единицы оборудования',
				type: 'equipment_pieces',
			});
		}
		return foldersList;
	}, [tree, selectedNodeId]);

	const selectedFolderType = useMemo(
		() =>
			folders.find(({ id }) => String(id) === selectedFolderId)?.type || null,
		[folders, selectedFolderId],
	);
	const channels = useMemo(
		() =>
			selectedFolderType === 'channels'
				? tree.filter(
						({ parentId, parentType, id }) =>
							String(parentId) === selectedFolderId &&
							parentType === selectedFolderType &&
							!tree.some(
								({ parentId, type }) =>
									parentId === id && type === 'equipment_piece',
							),
				  )
				: [],
		[selectedFolderType, selectedFolderId, tree],
	);

	const nodesOptions: SelectOption[] = useMemo(
		() =>
			nodes.map(({ id, displayName }) => ({
				id: String(id),
				name: displayName,
				isSelected: false,
			})),
		[nodes],
	);
	const foldersOptions: SelectOption[] = useMemo(
		() =>
			folders.map(({ id, displayName }) => ({
				id: String(id),
				name: displayName,
				isSelected: false,
			})),
		[folders],
	);
	const channelsOptions: SelectOption[] = useMemo(
		() =>
			channels.map(({ itemNumber, displayName }) => ({
				id: itemNumber || '',
				name: displayName,
				isSelected: false,
			})),
		[channels],
	);

	function handleNodeChange(value: SelectOption) {
		setSelectedNodeId(value.id);
	}
	function handleFolderChange(value: SelectOption) {
		setSelectedFolderId(value.id);
	}
	function handleChannelChange(value: SelectOption) {
		setSelectedChannelId(value.id);
	}
	function handleClose() {
		closeModal(RegisteredModals.LinkMeasuringInstrumentsNSI);
	}
	function handleConfirm() {
		if (
			user &&
			selectedNodeId &&
			(selectedFolderType === 'equipment_pieces' || !!selectedChannelId)
		) {
			const newNodeId =
				selectedFolderType === 'equipment_pieces'
					? Number(selectedNodeId)
					: null;
			const newChannelId =
				selectedFolderType === 'equipment_pieces'
					? null
					: Number(selectedChannelId);

			checkedInstruments.forEach(async ({ equipmentNumber }) => {
				linkEquipmentPieceFx({
					userId: user.preferredUsername,
					equipmentId: equipmentNumber,
					newNodeId: newNodeId,
					newChannelId: newChannelId,
					moduleName:
						ModuleName.UseLinkMeasuringInstrumentsNSI_linkEquipmentPieceFx,
				});
			});

			getNodeItemsListFx({
				userId: user.preferredUsername,
				nodeId: Number(selectedNodeId),
				action: NodeItemsActions.Set,
				moduleName:
					ModuleName.UseLinkMeasuringInstrumentsNSI_getNodeItemsListFx,
			});
			getMeasuringInstrumentsListFx({
				action: 'set',
				measurementTypeCode: null,
				equipmentShortName: null,
				manufacturerTypeName: null,
				factoryNumber: null,
				productionYear: null,
				userStatusCode: null,
				equipmentNumber: null,
				location: null,
				pageRowCount: 20,
				pageNumber: 1,
				firstRow: 0,
				selectRow: null,
				pageTotalCount: 0,
				userId: user.preferredUsername,
				moduleName:
					ModuleName.UseLinkMeasuringInstrumentsNSI_getMeasuringInstrumentsListFx,
			});
		}
		handleClose();
	}

	const currentDeviceName: string = currentDevice?.displayName || '-';
	const isChannelsSelectShown: boolean = selectedFolderType === 'channels';
	const isNodeEmpty: boolean = foldersOptions.length === 0;
	const isDeviceEmpty: boolean = nodesOptions.length === 0;
	const isWarningShown: boolean =
		isChannelsSelectShown && checkedInstruments.length > 1;
	const isConfirmButtonDisabled: boolean =
		isWarningShown ||
		checkedInstruments.length === 0 ||
		(isChannelsSelectShown && !selectedChannelId) ||
		!selectedFolderId ||
		!selectedNodeId;

	const nodeChildren = (
		<>
			<Select
				label="Папка"
				options={foldersOptions}
				value={selectedFolderId}
				onChange={handleFolderChange}
				className={styles.select}
			/>
			{isChannelsSelectShown && (
				<Select
					label="Канал"
					options={channelsOptions}
					value={selectedChannelId}
					onChange={handleChannelChange}
					className={styles.select}
				/>
			)}
		</>
	);

	const deviceChildren = (
		<>
			<Select
				label="Узел учета"
				options={nodesOptions}
				value={selectedNodeId}
				onChange={handleNodeChange}
				className={styles.select}
			/>
			{isNodeEmpty ? (
				<WarningMessage text="В данном узле учета нет каналов и оборудования" />
			) : (
				nodeChildren
			)}
		</>
	);

	useEffect(() => {
		if (user && selectedNodeId) {
			getNodeItemsListFx({
				userId: user.preferredUsername,
				nodeId: Number(selectedNodeId),
				action: NodeItemsActions.Set,
				moduleName:
					ModuleName.UseLinkMeasuringInstrumentsNSI_getNodeItemsListFx,
			});
		}
	}, [selectedNodeId, user]);

	useEffect(() => {
		if (foldersOptions.length > 0) {
			setSelectedFolderId(foldersOptions[0].id);
		}
	}, [foldersOptions]);

	useEffect(() => {
		if (channelsOptions.length > 0) {
			setSelectedChannelId(channelsOptions[0].id);
		}
	}, [channelsOptions]);
	useEffect(() => {
		if (selectedFolderType === 'equipment_pieces') {
			setSelectedChannelId('');
		}
	}, [selectedFolderType]);

	useEffect(() => {
		if (nodeId) {
			const selectedNode = String(
				tree.find(({ id }) => id === nodeId)?.id || '',
			);
			if (selectedNode) {
				setSelectedNodeId(selectedNode);
			}
		}
	}, [nodeId]);

	useEffect(() => {
		if (nodeItemId) {
			const selectedChannel = tree.find(
				({ id, type }) => id === nodeItemId && type === 'nsi_channel',
			);
			if (selectedChannel) {
				const selectedFolder = tree.find(
					({ id, type }) =>
						id === selectedChannel.parentId && type === 'channels',
				);
				if (selectedFolder) {
					setSelectedFolderId(String(selectedFolder.id));
				}
			}
		}
	}, [nodeItemId, tree]);

	return {
		currentDeviceName,
		isDeviceEmpty,
		isWarningShown,
		isConfirmButtonDisabled,
		header,
		data,
		deviceChildren,
		handleClose,
		handleConfirm,
	};
}

export default useLinkMeasuringInstrumentsNSI;
