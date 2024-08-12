import { MouseEvent, useEffect, useState } from 'react';
import { DropResult } from 'react-beautiful-dnd';
import { useStore } from 'effector-react';

import { Backspace, Bin, Plus } from '../../../Icons';
import { $user } from '../../../Models/Auth';
import {
	$contextMenuPrintFormPositionId,
	$printFormPositioningPositionId,
	$printFormPositions,
	$selectedPrintFormId,
	$selectedPrintFormPositionId,
} from '../../../Models/PrintForms';
import {
	createPrintFormPositionFx,
	deletePrintFormPositionFx,
	fetchPrintFormPositionsFx,
	fetchPriorityMethodsFx,
	movePrintFormPositionFx,
} from '../../../Models/PrintForms/effects';
import {
	setContextMenuPrintFormPositionId,
	setPrintFormPositioningNodeId,
	setSelectedPrintFormPositionId,
} from '../../../Models/PrintForms/events';
import { PrintFormPosition } from '../../../Shared/types';
import { ModuleName } from '../../../Shared/Types/moduleName';
import ContextMenu from '../../../UI/ContextMenu';
import {
	ContextMenuItem,
	ContextMenuPosition,
} from '../../../UI/ContextMenu/types';
import Table from '../../../UI/Table';
import { ITableBody, ITableColumn } from '../../../UI/Table/types';

import PrintFormsTableNodeCell from './partials/PrintFormsTableNodeCell';

import styles from './PrintFormsTable.module.css';

const headers: ITableColumn[] = [
	{
		accessor: 'dnd',
		text: '',
		sortOrder: 0,
	},
	{
		accessor: 'positionNumber',
		text: '№ позиции',
		sortOrder: 0,
	},
	{
		accessor: 'name',
		text: 'Наименование позиции',
		sortOrder: 0,
		width: 430,
	},
	{
		accessor: 'node',
		text: 'Привязка к узлу дерева',
		sortOrder: 0,
		width: 430,
	},
];

function PrintFormsTable() {
	const selectedPrintFormId = useStore($selectedPrintFormId);
	const selectedPrintFormPositionId = useStore($selectedPrintFormPositionId);
	const printFormPositioningPositionId = useStore(
		$printFormPositioningPositionId,
	);
	const printFormPositions = useStore($printFormPositions);
	const contextMenuPositionId = useStore($contextMenuPrintFormPositionId);
	const user = useStore($user);

	const [position, setPosition] = useState<ContextMenuPosition | null>(null);

	const scrollTree = (
		evt: MouseEvent<HTMLButtonElement>,
		position: PrintFormPosition,
	) => {
		evt.stopPropagation();
		setPrintFormPositioningNodeId(position.treeId || 0);
	};

	const getActivePosition = (): number | undefined => {
		const activePosition: number = printFormPositions.findIndex(
			(position) => position.id === selectedPrintFormPositionId,
		);
		if (activePosition === -1) {
			return;
		}
		return activePosition;
	};

	const handleDragEnd = (drop: DropResult) => {
		const { destination, source } = drop;
		if (!destination) {
			return;
		}
		const { index: to } = destination;
		const { index: from } = source;
		if (to === from) {
			return;
		}
		const positionFrom: PrintFormPosition = printFormPositions[from];
		const positionTo: PrintFormPosition = printFormPositions[to];
		movePrintFormPositionFx({
			from: positionFrom.id,
			to: positionTo.id,
			userId: user?.preferredUsername || '',
			moduleName: ModuleName.PrintFormsTable_movePrintFormPositionFx,
		});
	};

	const openContextMenu = (evt: MouseEvent) => {
		evt.preventDefault();
		setPosition({
			x: evt.pageX,
			y: evt.pageY,
		});
		setContextMenuPrintFormPositionId(Number(evt.currentTarget.id));
	};

	const addNewPosition = () => {
		createPrintFormPositionFx({
			id: contextMenuPositionId,
			userId: user?.preferredUsername || '',
			moduleName: ModuleName.PrintFormsTable_createPrintFormPositionFx,
		});
	};

	const deletePosition = () => {
		deletePrintFormPositionFx({
			id: contextMenuPositionId,
			userId: user?.preferredUsername || '',
			moduleName: ModuleName.PrintFormsTable_deletePrintFormPositionFx,
		});
	};

	const data: ITableBody[] = printFormPositions.map((position) => ({
		dataLine: [
			{
				accessor: 'positionNumber',
				text: position.positionNumber || '',
			},
			{
				accessor: 'name',
				text: position.name,
			},
			{
				accessor: 'node',
				text: position.treeName,
				renderCell: position.treeId
					? () => (
							<PrintFormsTableNodeCell
								position={position}
								handleClick={scrollTree}
							/>
					  )
					: undefined,
			},
		],
		onRowClick: () => setSelectedPrintFormPositionId(position.id),
		onContextMenu: openContextMenu,
		id: position.id,
	}));

	const contextMenuItems: ContextMenuItem[] = [
		{
			name: 'Новая позиция',
			onClick: addNewPosition,
			renderFn: () => (
				<div className={'context_menu_item'}>
					<Plus className={'context_menu_icon'} />
					<span>Новая позиция</span>
				</div>
			),
		},
		{
			name: 'Очистить содержимое',
			onClick: () => {},
			renderFn: () => (
				<div className={'context_menu_item'}>
					<Backspace className={'context_menu_icon'} />
					<span>Очистить содержимое</span>
				</div>
			),
		},
		{
			name: 'Удалить',
			onClick: deletePosition,
			renderFn: () => (
				<div className={'context_menu_item'}>
					<Bin className={'context_menu_icon'} />
					<span>Удалить</span>
				</div>
			),
		},
	];

	useEffect(() => {
		if (selectedPrintFormId) {
			fetchPrintFormPositionsFx({
				printFormId: selectedPrintFormId,
				userId: user?.preferredUsername || '',
				moduleName: ModuleName.PrintFormsTable_fetchPrintFormPositionsFx,
			});
		}
	}, [selectedPrintFormId]);

	useEffect(() => {
		if (!printFormPositioningPositionId) {
			return;
		}
		const row: HTMLElement | null = document.getElementById(
			printFormPositioningPositionId.toString(),
		);
		if (!row) {
			return;
		}
		row.scrollIntoView({ behavior: 'smooth' });
	}, [printFormPositioningPositionId]);

	useEffect(() => {
		fetchPriorityMethodsFx();
	}, []);

	return (
		<>
			<Table
				className={styles.table}
				headers={headers}
				data={data}
				isDraggable
				droppableId={'position'}
				onDragEnd={handleDragEnd}
				activeIndex={getActivePosition()}
			/>
			<ContextMenu
				items={contextMenuItems}
				position={position}
				setPosition={setPosition}
			/>
		</>
	);
}

export default PrintFormsTable;
