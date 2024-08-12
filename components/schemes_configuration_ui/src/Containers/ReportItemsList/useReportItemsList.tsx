import React, {
	ChangeEvent,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from 'react';
import { useStore } from 'effector-react';

import { ArrowDown, ArrowsOpposite, ArrowUp, Close, Plus } from '../../Icons';
import Hierarchy from '../../Icons/Hierarchy';
import { $user } from '../../Models/Auth';
import { openModal } from '../../Models/Modal/events';
import {
	$reportItemContextMenuId,
	$selectedReportId,
	INITIAL_REPORT_ITEM_DATA,
} from '../../Models/ReferenseByReports';
import {
	setEditReportItemData,
	setReportItemContextMenuId,
} from '../../Models/ReferenseByReports/events';
import { $reportItems } from '../../Models/ReportItems';
import {
	fetchReportItemsListFx,
	moveReportItemFx,
} from '../../Models/ReportItems/effects';
import {
	onToggleReportItem,
	setReportItemsList,
} from '../../Models/ReportItems/events';
import { ReportItem } from '../../Models/ReportItems/types';
import { RegisteredModals } from '../../Shared/modalsConfig';
import { ModuleName } from '../../Shared/Types/moduleName';
import {
	ContextMenuItem,
	ContextMenuPosition,
} from '../../UI/ContextMenu/types';
import { IconDelete, IconEditing } from '../../UI/Parameter/iconEditing';

import styles from '../ReportsSection/ReportsSection.module.css';

export function useReportItemsList() {
	const selectedReportId = useStore($selectedReportId);
	const user = useStore($user);
	const reportItems = useStore($reportItems);
	const handleExpand = useCallback(
		(id: number) => onToggleReportItem(id),
		[onToggleReportItem],
	);

	const contextMenuId = useStore($reportItemContextMenuId);

	const selectedReportItem =
		reportItems.find((reportItem) => reportItem.id === contextMenuId) ||
		INITIAL_REPORT_ITEM_DATA;

	const [position, setPosition] = useState<ContextMenuPosition | null>(null);
	// Поиск элементов по названию позиции
	const [positionName, setPositionName] = useState('');
	// Поиск элементов по названию
	const [pointName, setPointName] = useState('');

	// Id параметра, вызванного для переноса через контекстного меню
	const [draggableId, setDraggableId] = useState<number>(0);

	// Id параметра, вызванного для переноса через контекстного меню
	const [focusedId, setFocusedId] = useState<number>(0);

	// Режим, когда в контекстном меню нажали "Переместить"
	const [isDndMode, setDndMode] = useState<boolean>(false);

	const filteredTree: ReportItem[] = useMemo(() => {
		if (!positionName && !pointName) {
			return reportItems;
		}
		const positionNameMask: RegExp = new RegExp(positionName, 'gi');
		const pointNameMask: RegExp = new RegExp(pointName, 'gi');
		const rootNodes: ReportItem[] = reportItems
			.filter(
				(node) =>
					positionNameMask.test(node.positionName) &&
					pointNameMask.test(node.pointName),
			)
			.map((node) => ({ ...node, parentId: null }));
		const subNodes = reportItems.filter((node) => node.parentId);
		// If there is no overlap by name, return empty array
		const finalTree: ReportItem[] = rootNodes.length
			? [...rootNodes, ...subNodes]
			: [];
		return finalTree;
	}, [reportItems, positionName, pointName]);

	const handlePositionName = useCallback(
		(e: ChangeEvent<HTMLInputElement>) => {
			setPositionName(e.target.value);
		},
		[setPositionName],
	);

	const handlePointName = useCallback(
		(e: ChangeEvent<HTMLInputElement>) => {
			setPointName(e.target.value);
		},
		[setPointName],
	);

	const onOpen = useCallback((evt: React.MouseEvent, id: number) => {
		evt.preventDefault();
		setPosition({ x: evt.pageX, y: evt.pageY });
		setFocusedId(id);
		setReportItemContextMenuId(id);
	}, []);

	const onCloseContextMenu = () => {
		// При закрытии контекстного меню сбрасываем подсветку параметра
		setFocusedId(0);
	};

	const handleMoveReportItem = useCallback(
		(insertPosition: number) => {
			if (!user) return;
			moveReportItemFx({
				id: draggableId,
				targetId: focusedId,
				insertPosition,
				userId: user.preferredUsername,
				moduleName: ModuleName.UseReportItemsList_moveReportItemFx,
			});
			setDraggableId(0);
			setDndMode(false);
		},
		[draggableId, focusedId],
	);

	const items: ContextMenuItem[] = useMemo(
		() => [
			{
				name: 'Новая отчетная позиция',
				onClick: () => {
					openModal(RegisteredModals.CreateReportItem);
				},
				renderFn: () => (
					<span className={styles.context_menu_item}>
						<Plus className={styles.icon} />
						<span>Новая отчетная позиция</span>
					</span>
				),
				withSeparator: true,
			},
			{
				name: 'Редактировать',
				onClick: () => {
					if (!user) return;
					const {
						id,
						positionName,
						isCalculated,
						reportPositionNumber,
						coefficient,
						pointId,
						activeTo,
						activeFrom,
					} = selectedReportItem;
					setEditReportItemData({
						id,
						positionName,
						isCalculated,
						reportPositionNumber,
						coefficient,
						pointId,
						activeTo,
						activeFrom,
						userId: user.preferredUsername,
						moduleName: ModuleName.UseReportItemsList_setEditReportItemData,
					});
					openModal(RegisteredModals.EditReportItem);
				},
				renderFn: () => (
					<span className={styles.context_menu_item}>
						<IconEditing className={styles.icon} />
						<span>Редактировать</span>
					</span>
				),
			},
			{
				name: 'Переместить',
				onClick: () => {
					setDndMode(true);
					setDraggableId(contextMenuId);
				},
				renderFn: () => (
					<span className={styles.context_menu_item}>
						<ArrowsOpposite className={styles.icon} />
						<span>Переместить</span>
					</span>
				),
			},
			{
				name: 'Удалить',
				onClick: () => {
					openModal(RegisteredModals.DeleteReportItem);
				},
				renderFn: () => (
					<span className={styles.context_menu_item}>
						<IconDelete className={styles.icon} />
						<span>Удалить</span>
					</span>
				),
			},
		],
		[contextMenuId, draggableId, isDndMode, user, selectedReportItem],
	);

	const moveItems: ContextMenuItem[] = useMemo(
		() => [
			{
				name: 'Выше текущего узла',
				onClick: () => {
					handleMoveReportItem(1);
				},
				renderFn: () => (
					<span className={styles.context_menu_item}>
						<ArrowUp className={styles.icon} />
						<span>Выше текущего узла</span>
					</span>
				),
			},
			{
				name: 'Ниже текущего узла',
				onClick: () => {
					handleMoveReportItem(2);
				},
				renderFn: () => (
					<span className={styles.context_menu_item}>
						<ArrowDown className={styles.icon} />
						<span>Ниже текущего узла</span>
					</span>
				),
			},
			{
				name: 'Вставить потомком текущего узла',
				onClick: () => {
					handleMoveReportItem(5);
				},
				renderFn: () => (
					<span className={styles.context_menu_item}>
						<Hierarchy className={styles.icon} />
						<span>Вставить потомком текущего узла</span>
					</span>
				),
				withSeparator: true,
			},
			{
				name: 'Отменить перенос',
				onClick: () => {
					setDndMode(false);
					setDraggableId(0);
				},
				renderFn: () => (
					<span className={styles.context_menu_item}>
						<Close className={styles.icon} />
						<span>Отменить перенос</span>
					</span>
				),
			},
		],
		[contextMenuId, draggableId, isDndMode, user],
	);

	useEffect(() => {
		if (selectedReportId && user) {
			fetchReportItemsListFx({
				id: selectedReportId,
				userId: user.preferredUsername,
				moduleName: ModuleName.UseReportItemsList_fetchReportItemsListFx,
			});
		} else setReportItemsList([]);
	}, [selectedReportId, user]);

	return {
		filteredTree,
		handleExpand,
		handlePositionName,
		handlePointName,
		positionName,
		pointName,
		items,
		onOpen,
		onCloseContextMenu,
		position,
		setPosition,
		draggableId,
		focusedId,
		isDndMode,
		moveItems,
	};
}
