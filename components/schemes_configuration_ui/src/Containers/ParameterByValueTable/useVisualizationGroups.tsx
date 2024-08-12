import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { DropResult } from 'react-beautiful-dnd';
import clsx from 'clsx';
import { useStore } from 'effector-react';

import { Comment, Edit, Search } from '../../Icons';
import { $accountingNode } from '../../Models/AccountingNode';
import { setAccountingNode } from '../../Models/AccountingNode/events';
import { $user } from '../../Models/Auth';
import { setEditVisualizationGroupData } from '../../Models/EditVisualizationGroupForm/events';
import { $energyResourceId } from '../../Models/EnergyResources';
import { closeModal, openModal } from '../../Models/Modal/events';
import {
	$visualizationGroupsSortFilter,
	$visualizationGroupsTable,
} from '../../Models/VisualizationGroups';
import {
	fetchVisualizationGroupsListFx,
	moveVisualizationGroupSortOrderFx,
} from '../../Models/VisualizationGroups/effects';
import {
	setActiveVisualizationGroupIdEvent,
	setCurrentVisualizationGroupIdEvent,
	setVisualizationGroupsSortFilterEvent,
} from '../../Models/VisualizationGroups/events';
import { VisualizationGroupList } from '../../Models/VisualizationGroups/types';
import { RegisteredModals } from '../../Shared/modalsConfig';
import { SortOrder } from '../../Shared/types';
import { ModuleName } from '../../Shared/Types/moduleName';
import {
	ContextMenuItem,
	ContextMenuPosition,
} from '../../UI/ContextMenu/types';
import MultiselectDropdownSearchAndSortRender from '../../UI/MultiselectDropdown/MultiselectDropdownSearchAndSortRender';
import { IconDelete } from '../../UI/Parameter/iconEditing';
import { ITableBody, ITableColumn } from '../../UI/Table/types';
import { getSortOrder, sortByOrder } from '../../Utils/tableUtils';
import ReportTableRadioButtonCell from '../ReportTable/ReportTableRadioButtonCell';

import { Accessors, SearchTextName, SearchTextParams } from './types';

import styles from './VisualizationGroups.module.css';

export function useVisualizationGroups() {
	const user = useStore($user);
	const accountingNode = useStore($accountingNode);
	const {
		visualizationGroups,
		activeVisualizationGroupId,
		currentVisualizationGroupId,
	} = useStore($visualizationGroupsTable);
	const energyResourceId = useStore($energyResourceId);
	const sortFilter = useStore($visualizationGroupsSortFilter);

	// текущая активная группа
	const [localVisualizationActiveGroupId, setLocalVisualizationActiveGroupId] =
		useState<number | null>(activeVisualizationGroupId);
	// стор положения контекстного меню
	const [position, setPosition] = useState<ContextMenuPosition | null>(null);
	/* Текущие отсортированные и преобразованные данные.
	Изначально изначально все данные visualizationGroups */
	const [visualizationGroupsData, setVisualizationGroupsData] = useState<
		ITableBody[]
	>([]);

	// стор текстовых фильтров
	const [searchData, setSearchData] = useState<SearchTextParams>({
		shortName: '',
		name: '',
	});

	// функция поиска по тексту
	const setSearchText = useCallback(
		(val: string, searchFilterName: SearchTextName) => {
			setSearchData({
				...searchData,
				[searchFilterName]: val,
			});
		},
		[searchData],
	);

	// выбранная через контекстное меню группа (не бывает undefined)
	const currentVisualizationGroup = visualizationGroups.find(
		(visualizationGroup) =>
			visualizationGroup.visualizationGroupId === currentVisualizationGroupId,
	)!;

	// запрос на изменение порядка в таблице
	const onMoveGroups = async (source: number, destination: number) => {
		if (!user) return;
		const [movedGroup, placedGroup] = [
			visualizationGroups[source],
			visualizationGroups[destination],
		];
		moveVisualizationGroupSortOrderFx({
			fromId: movedGroup.visualizationGroupId,
			toId: destination === 0 ? 0 : placedGroup.visualizationGroupId,
			lastModified: movedGroup.lastModified,
			userId: user.preferredUsername,
			moduleName:
				ModuleName.UseVisualizationGroups_moveVisualizationGroupSortOrderFx,
		});
	};

	// функция для перетаскивания элементов таблицы
	const onDragEnd = (result: DropResult) => {
		const { source, destination } = result;
		if (!destination) {
			return;
		}
		if (destination.index === source.index) {
			return;
		}
		if (destination.index === 0) {
			onMoveGroups(source.index, destination.index);
		} else {
			onMoveGroups(
				source.index,
				source.index > destination.index
					? destination.index - 1
					: destination.index,
			);
		}
	};

	// логика клика на сортировку в заголовках таблицы
	const handleSortOptions = (accessor: string) => {
		if (sortFilter.accessor === accessor) {
			const order: SortOrder = getSortOrder(sortFilter.order);
			setVisualizationGroupsSortFilterEvent({ accessor, order });
		} else {
			setVisualizationGroupsSortFilterEvent({
				accessor: accessor as Accessors,
				order: SortOrder.Asc,
			});
		}
	};

	// получить стили для иконки сортировки в заголовках таблицы
	const getSortStyles = (accessor: Accessors) => {
		return {
			[styles.sort_icon_asc]:
				sortFilter.accessor === accessor && sortFilter.order === SortOrder.Asc,
			[styles.sort_icon_desc]:
				sortFilter.accessor === accessor && sortFilter.order === SortOrder.Desc,
			[styles.sort_icon]: true,
		};
	};

	const onOpen = useCallback((evt: React.MouseEvent, id: number) => {
		evt.preventDefault();
		setPosition({ x: evt.pageX, y: evt.pageY });
		setCurrentVisualizationGroupIdEvent(id);
	}, []);

	const header: ITableColumn[] = [
		{
			accessor: 'shortName',
			text: 'Наименование в отчете',
			isResizable: false,
			isSortable: false,
			sortOrder: 0,
			minWidth: 150,
			width: 250,
			renderHeaderCell: MultiselectDropdownSearchAndSortRender({
				placeholder: 'Наименование в отчете',
				searchValue: searchData.shortName,
				onSearch: (value: string) => {
					setSearchText(value, SearchTextName.shortName);
				},
				isSearchable: true,
				isSortable: true,
				onSortClick: handleSortOptions,
				accessor: 'shortName',
				sortClassName: clsx(getSortStyles('shortName')),
				glyph: <Search className={styles.sort_icon} />,
				className: styles.header_searchable,
			}),
		},
		{
			accessor: 'name',
			text: 'Полное наименование',
			isResizable: false,
			isSortable: false,
			sortOrder: 0,
			minWidth: 200,
			width: 300,
			renderHeaderCell: MultiselectDropdownSearchAndSortRender({
				placeholder: 'Полное наименование',
				searchValue: searchData.name,
				onSearch: (value: string) => {
					setSearchText(value, SearchTextName.name);
				},
				isSearchable: true,
				isSortable: true,
				onSortClick: handleSortOptions,
				accessor: 'name',
				sortClassName: clsx(getSortStyles('name')),
				glyph: <Search className={styles.sort_icon} />,
				className: styles.header_searchable,
			}),
		},
		{
			accessor: 'comment',
			text: 'Коммент.',
			isResizable: false,
			isSortable: false,
			sortOrder: 0,
			minWidth: 20,
			width: 20,
			renderHeaderCell: () => (
				<div className={styles.header_comment}>
					<Comment className={styles.comment_icon} />
				</div>
			),
		},
	];

	const items: ContextMenuItem[] = useMemo(() => {
		const handleEditGroup = () => {
			const {
				visualizationGroupId,
				sortOrder,
				shortName,
				name,
				comment,
				lastModified,
			} = currentVisualizationGroup;
			setEditVisualizationGroupData({
				visualizationGroupId,
				sortOrder,
				shortName,
				name,
				comment,
				lastModified,
			});
			openModal(RegisteredModals.EditVisualizationGroupForm);
		};

		const handleDelete = () => {
			openModal(RegisteredModals.DeleteVisualizationGroup);
		};

		return [
			{
				name: 'Редактировать',
				onClick: handleEditGroup,
				renderFn: () => (
					<span className={styles.context_menu_item}>
						<Edit className={styles.context_menu_icon} />
						<span>Редактировать</span>
					</span>
				),
			},
			{
				name: 'Удалить',
				onClick: handleDelete,
				renderFn: () => (
					<span className={styles.context_menu_item}>
						<IconDelete className={styles.context_menu_icon} />
						<span>Удалить</span>
					</span>
				),
			},
		];
	}, [currentVisualizationGroup]);

	const onCancel = () => {
		closeModal(RegisteredModals.VisualizationGroups);
	};

	const onAddGroup = () => {
		openModal(RegisteredModals.EditVisualizationGroupForm);
	};

	const onConfirm = () => {
		closeModal(RegisteredModals.VisualizationGroups);
		setActiveVisualizationGroupIdEvent(localVisualizationActiveGroupId);
		setAccountingNode({
			...accountingNode,
			dailyPointGroupsId: localVisualizationActiveGroupId,
		});
	};

	// фильтруем группы по значениям в поисковых полях
	const getVisualizationGroupsFilteredData = useCallback(
		(
			initVisualizationGroups: VisualizationGroupList[],
		): VisualizationGroupList[] => {
			const searchValuesCount: number = Object.values(searchData).filter(
				(item) => !!item,
			).length;

			// если поисковые поля не пустые
			if (searchValuesCount > 0) {
				const visualizationGroupsFilteredData: VisualizationGroupList[] =
					initVisualizationGroups.filter((initVisualizationGroup) => {
						// счетчик совпадений для каждой точки
						let matchesCount = 0;

						for (const textFilter of Object.keys(searchData)) {
							if (
								!!searchData[textFilter as keyof typeof searchData] &&
								String(
									initVisualizationGroup[
										textFilter as keyof typeof initVisualizationGroup
									],
								)
									.toLowerCase()
									.includes(
										searchData[
											textFilter as keyof typeof searchData
										].toLowerCase(),
									)
							)
								matchesCount += 1;
						}

						return matchesCount >= searchValuesCount;
					});

				return visualizationGroupsFilteredData;
			}

			return initVisualizationGroups;
		},
		[searchData],
	);

	// начальный запрос списка групп визуализации
	useEffect(() => {
		if (!user) return;
		fetchVisualizationGroupsListFx({
			energyResourceId,
			userId: user.preferredUsername,
			moduleName:
				ModuleName.UseVisualizationGroups_fetchVisualizationGroupsListFx,
		});
	}, [energyResourceId, user]);

	// эффект для фильтра данных при изменении любого фильтра шапки
	useEffect(() => {
		// фильтруем группы по значениям в поисковых полях
		const visualizationGroupsFilteredData: VisualizationGroupList[] =
			getVisualizationGroupsFilteredData(visualizationGroups);

		// формируем данные для тела таблицы
		const tableBody: ITableBody[] = visualizationGroupsFilteredData.map(
			(visualizationGroup) => ({
				dataLine: [
					{
						accessor: 'shortName',
						text: visualizationGroup.shortName,
						renderCell: () => (
							<ReportTableRadioButtonCell
								title={visualizationGroup.shortName}
								selected={
									visualizationGroup.visualizationGroupId ===
									localVisualizationActiveGroupId
								}
								className={styles.radio_button_text}
							/>
						),
					},
					{
						accessor: 'name',
						text: visualizationGroup.name,
						renderCell: () => (
							<span title={visualizationGroup.name}>
								{visualizationGroup.name}
							</span>
						),
					},
					{
						accessor: 'comment',
						text: visualizationGroup.comment,
						renderCell: () => (
							<span title={visualizationGroup.comment}>
								<Comment
									className={clsx(
										styles.comment_icon,
										visualizationGroup.comment && styles.comment_icon__active,
									)}
								/>
							</span>
						),
					},
				],
				rowClassName: clsx(
					styles.row,
					visualizationGroup.visualizationGroupId ===
						localVisualizationActiveGroupId &&
						styles.active__visualization_group,
				),
				onRowClick: () => {
					// устанавливаем активную группу в стейт
					setLocalVisualizationActiveGroupId(
						visualizationGroup.visualizationGroupId,
					);
				},
				onContextMenu: (evt: React.MouseEvent) =>
					onOpen(evt, visualizationGroup.visualizationGroupId),
			}),
		);

		const sortedData: ITableBody[] =
			sortFilter.order === SortOrder.None
				? tableBody
				: sortByOrder(tableBody, sortFilter.accessor, sortFilter.order);
		setVisualizationGroupsData(sortedData);
	}, [
		visualizationGroups,
		sortFilter,
		searchData,
		onOpen,
		localVisualizationActiveGroupId,
		getVisualizationGroupsFilteredData,
		energyResourceId,
	]);

	return {
		header,
		visualizationGroupsData,
		onDragEnd,
		onOpen,
		position,
		setPosition,
		items,
		onCancel,
		onAddGroup,
		onConfirm,
	};
}
