import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { DropResult } from 'react-beautiful-dnd';
import { toast } from 'react-toastify';
import clsx from 'clsx';
import { useStore } from 'effector-react';

import pointsTableBodyAdapter from '../../Adapters/Points/pointsTableBodyAdapter';
import { Comment, Edit, Filter, Plus, Search } from '../../Icons';
import { $user } from '../../Models/Auth';
import {
	$energyResourceId,
	$energyResources,
} from '../../Models/EnergyResources';
import { fetchEnergyResourcesListFx } from '../../Models/EnergyResources/effects';
import { openModal } from '../../Models/Modal/events';
import {
	$contextMenuId,
	$editPointData,
	$focusOnPoint,
	$points,
	$pointsSortFilter,
} from '../../Models/Points';
import {
	fetchPointsListFx,
	movePointsSortOrderFx,
} from '../../Models/Points/effects';
import {
	changeIsActivePointEvent,
	onCollapse,
	setContextMenuIdEvent,
	setEditPointData,
	setFocusPointId,
	setPointsTableSortFilterEvent,
} from '../../Models/Points/events';
import {
	Accessors,
	ActivePoint,
	Point,
	SearchTextName,
	SearchTextParams,
	SelectedFilterOption,
} from '../../Models/Points/types';
import { RegisteredModals } from '../../Shared/modalsConfig';
import { FilterOptions, SortOrder } from '../../Shared/types';
import { ModuleName } from '../../Shared/Types/moduleName';
import {
	ContextMenuItem,
	ContextMenuPosition,
} from '../../UI/ContextMenu/types';
import MultiselectDropdown from '../../UI/MultiselectDropdown';
import MultiselectDropdownSearchAndSortRender from '../../UI/MultiselectDropdown/MultiselectDropdownSearchAndSortRender';
import { IconDelete } from '../../UI/Parameter/iconEditing';
import { ITableBody, ITableColumn } from '../../UI/Table/types';
import { getSortOrder, sortByOrder } from '../../Utils/tableUtils';

import styles from './PointsReports.module.css';

export function usePointsReports() {
	const user = useStore($user);
	const energyResources = useStore($energyResources);
	const energyResourceId = useStore($energyResourceId);
	const points = useStore($points);
	const { focusPointId } = useStore($focusOnPoint);
	const editPointData = useStore($editPointData);
	const sortFilter = useStore($pointsSortFilter);
	const contextMenuId = useStore($contextMenuId);
	// Текущие отсортированные и преобразованные данные. Изначально изначально все данные points
	const selectedPoint = points.find((point) => point.id === contextMenuId);
	// Стор положения контекстного меню
	const [position, setPosition] = useState<ContextMenuPosition | null>(null);
	/* Текущие отсортированные и преобразованные данные. Изначально изначально все данные points */
	const [pointsData, setPointsData] = useState<ITableBody[]>([]);

	// Фильтр связ. канала
	const [linkedChannelOptions, setLinkedChannelOptions] = useState<
		FilterOptions[]
	>([
		{ name: 'Да', key: '1', isChecked: true },
		{ name: 'Нет', key: '2', isChecked: true },
	]);

	// Выбранные опции фильтра связ. канала
	const [selectedLinkedOptions, setSelectedLinkedOptions] = useState<
		SelectedFilterOption[]
	>(['Да', 'Нет']);

	// стор текстовых фильтров
	const [searchData, setSearchData] = useState<SearchTextParams>({
		captionName: '',
		name: '',
		channelNumber: '',
		channelName: '',
		deviceNumber: '',
		coefficient: '',
	});

	// Фильтр привязанной точки учета

	const [linkedPointOptions, setLinkedPointOptions] = useState<FilterOptions[]>(
		[
			{ name: 'Да', key: '1', isChecked: true },
			{ name: 'Нет', key: '2', isChecked: true },
		],
	);

	// Выбранные опции фильтра связ. канала
	const [selectedLinkedPointOptions, setSelectedLinkedPointOptions] = useState<
		SelectedFilterOption[]
	>(['Да', 'Нет']);

	const changeLinkedPointOption = useCallback(
		(key: string) => {
			return linkedPointOptions.map((option) => {
				if (option.key === key)
					return { ...option, isChecked: !option.isChecked };
				return option;
			});
		},
		[linkedPointOptions],
	);
	// Функция поиска по тексту
	const setSearchText = useCallback(
		(val: string, searchFilterName: SearchTextName) => {
			setSearchData({
				...searchData,
				[searchFilterName]: val,
			});
		},
		[searchData],
	);

	// Функции фильтрации по наличию связанной точки учета
	const onSelectLinkedPointOption = (key: string) => {
		setLinkedPointOptions(changeLinkedPointOption(key));
	};

	const onApplyLinkedPointOptions = () => {
		const linkedOptions = linkedPointOptions
			.filter((item) => item.isChecked)
			.map((item) => item.name) as SelectedFilterOption[];
		const linkedOptionsCount = linkedOptions.length;
		setSelectedLinkedPointOptions(
			linkedOptionsCount ? linkedOptions : ['Да', 'Нет'],
		);
	};

	const changeLinkedOption = useCallback(
		(key: string) => {
			return linkedChannelOptions.map((option) => {
				if (option.key === key)
					return { ...option, isChecked: !option.isChecked };
				return option;
			});
		},
		[linkedChannelOptions],
	);

	const onSelectLinkedOption = (key: string) => {
		setLinkedChannelOptions(changeLinkedOption(key));
	};

	const onApplyLinkedOptions = () => {
		const linkedOptions = linkedChannelOptions
			.filter((item) => item.isChecked)
			.map((item) => item.name) as SelectedFilterOption[];
		const linkedOptionsCount = linkedOptions.length;
		setSelectedLinkedOptions(
			linkedOptionsCount ? linkedOptions : ['Да', 'Нет'],
		);
	};

	// Запрос на изменение порядка в таблице
	const onMovePoints = async (source: number, destination: number) => {
		if (!user) return;
		const [movedPoint, placedPoint] = [points[source], points[destination]];
		movePointsSortOrderFx({
			fromId: movedPoint.id,
			toId: destination === 0 ? 0 : placedPoint.id,
			lastModified: movedPoint.lastModified,
			userId: user.preferredUsername,
			moduleName: ModuleName.UsePointsReports_movePointsSortOrderFx,
		})
			.then(() => {
				toast.success('Группа успешно перемещена');
			})
			.catch(() => {
				toast.error('Не удалось переместить группу');
			});
	};

	// Функция для перетаскивания элементов таблицы
	const onDragEnd = (result: DropResult) => {
		const { source, destination } = result;
		if (!destination) {
			return;
		}
		if (destination.index === source.index) {
			return;
		}
		if (destination.index === 0) {
			onMovePoints(source.index, destination.index);
		} else {
			onMovePoints(
				source.index,
				source.index > destination.index
					? destination.index - 1
					: destination.index,
			);
		}
	};

	// Логика клика на сортировку в заголовках таблицы
	const handleSortOptions = (accessor: string) => {
		if (sortFilter.accessor === accessor) {
			const order: SortOrder = getSortOrder(sortFilter.order);
			setPointsTableSortFilterEvent({ accessor, order });
		} else {
			setPointsTableSortFilterEvent({
				accessor: accessor as Accessors,
				order: SortOrder.Asc,
			});
		}
	};

	// Получить стили для иконки сортировки в заголовках таблицы
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
		setContextMenuIdEvent(id);
	}, []);

	const header: ITableColumn[] = [
		{
			accessor: 'collapse',
			text: '',
			isResizable: false,
			isSortable: false,
			sortOrder: 0,
			minWidth: 50,
			width: 50,
		},
		{
			accessor: 'captionName',
			text: 'Наименование в отчете',
			isResizable: false,
			isSortable: false,
			sortOrder: 0,
			minWidth: 150,
			width: 250,
			renderHeaderCell: MultiselectDropdownSearchAndSortRender({
				placeholder: 'Наименование в отчете',
				searchValue: searchData.captionName,
				onSearch: (value: string) => {
					setSearchText(value, SearchTextName.captionName);
				},
				isSearchable: true,
				isSortable: true,
				onSortClick: handleSortOptions,
				accessor: 'captionName',
				sortClassName: clsx(getSortStyles('captionName')),
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
			minWidth: 30,
			width: 50,
			renderHeaderCell: () => (
				<div className={styles.header_comment}>
					<Comment className={styles.comment_icon} />
				</div>
			),
		},
		{
			accessor: 'isLinked',
			text: 'Связ. канал',
			isResizable: false,
			isSortable: false,
			sortOrder: 0,
			width: 110,
			renderHeaderCell: () => (
				<div className={styles.filter_wrapper}>
					<span>Связ. канал</span>
					<MultiselectDropdown
						title={''}
						className={styles.filter_header}
						rightIcon={<Filter className={styles.filter_icon} />}
						onApply={onApplyLinkedOptions}
						isItemsListVisible
						items={linkedChannelOptions}
						onSelect={onSelectLinkedOption}
					/>
				</div>
			),
		},
		{
			accessor: 'channelNumber',
			text: '№ канала',
			isResizable: false,
			isSortable: false,
			sortOrder: 0,
			minWidth: 100,
			width: 160,
			renderHeaderCell: MultiselectDropdownSearchAndSortRender({
				placeholder: '№ канала',
				searchValue: searchData.channelNumber,
				onSearch: (value: string) => {
					setSearchText(value, SearchTextName.channelNumber);
				},
				isSearchable: true,
				isSortable: true,
				onSortClick: handleSortOptions,
				accessor: 'channelNumber',
				sortClassName: clsx(getSortStyles('channelNumber')),
				glyph: <Search className={styles.sort_icon} />,
				className: styles.header_searchable,
			}),
		},
		{
			accessor: 'channelName',
			text: 'Наименование канала',
			isResizable: false,
			isSortable: false,
			sortOrder: 0,
			minWidth: 100,
			width: 305,
			renderHeaderCell: MultiselectDropdownSearchAndSortRender({
				placeholder: 'Наименование канала',
				searchValue: searchData.channelName,
				onSearch: (value: string) => {
					setSearchText(value, SearchTextName.channelName);
				},
				isSearchable: true,
				isSortable: false,
				accessor: 'channelName',
				glyph: <Search className={styles.sort_icon} />,
				className: styles.header_searchable,
			}),
		},
		{
			accessor: 'deviceNumber',
			text: '№ прибора',
			isResizable: false,
			isSortable: false,
			sortOrder: 0,
			minWidth: 100,
			width: 170,
			renderHeaderCell: MultiselectDropdownSearchAndSortRender({
				placeholder: '№ прибора',
				searchValue: searchData.deviceNumber,
				onSearch: (value: string) => {
					setSearchText(value, SearchTextName.deviceNumber);
				},
				isSearchable: true,
				isSortable: true,
				onSortClick: handleSortOptions,
				accessor: 'deviceNumber',
				sortClassName: clsx(getSortStyles('deviceNumber')),
				glyph: <Search className={styles.sort_icon} />,
				className: styles.header_searchable,
			}),
		},
		{
			accessor: 'coefficient',
			text: 'Коэфф.',
			isResizable: false,
			isSortable: false,
			sortOrder: 0,
			minWidth: 100,
			width: 140,
			renderHeaderCell: MultiselectDropdownSearchAndSortRender({
				placeholder: 'Коэфф.',
				searchValue: searchData.coefficient,
				onSearch: (value: string) => {
					setSearchText(value, SearchTextName.coefficient);
				},
				isSearchable: true,
				isSortable: true,
				onSortClick: handleSortOptions,
				accessor: 'coefficient',
				sortClassName: clsx(getSortStyles('coefficient')),
				glyph: <Search className={styles.sort_icon} />,
				className: styles.header_searchable,
			}),
		},
		{
			accessor: 'linkedPoint',
			text: 'Привязанная точка учета',
			isResizable: false,
			isSortable: false,
			sortOrder: 0,
			minWidth: 100,
			width: 307,
			renderHeaderCell: () => (
				<div className={styles.filter_wrapper}>
					<span>Привязанная точка учета</span>
					<MultiselectDropdown
						title={''}
						className={styles.filter_header}
						rightIcon={<Filter className={styles.filter_icon} />}
						onApply={onApplyLinkedPointOptions}
						isItemsListVisible
						items={linkedPointOptions}
						onSelect={onSelectLinkedPointOption}
					/>
				</div>
			),
		},
	];

	const items: ContextMenuItem[] = useMemo(
		() => [
			{
				name: 'Добавить сверху',
				onClick: () => {
					const { id, energyResource } = selectedPoint as Point;
					const pointIndex = points.findIndex((point) => point.id === id);
					const prevId = pointIndex === 0 ? 0 : points[pointIndex - 1].id;

					setEditPointData({
						...editPointData,
						energyResource,
						prevId,
					});
					openModal(RegisteredModals.EditPoint);
				},
				renderFn: () => (
					<span className={styles.context_menu_item}>
						<Plus className={styles.icon} />
						<span>Добавить сверху</span>
					</span>
				),
			},
			{
				name: 'Редактировать',
				onClick: () => {
					const {
						name,
						shortName,
						linkedPointId,
						comment,
						captionName,
						lastModified,
						energyResource,
						id,
						linkedPointName,
						linkedPointComment,
						linkedPointRatio,
					} = selectedPoint as Point;
					openModal(RegisteredModals.EditPoint);
					setEditPointData({
						id,
						shortName,
						linkedPointId,
						linkedPointName,
						linkedPointComment,
						linkedPointRatio,
						comment,
						captionName,
						name,
						lastModified,
						energyResource,
						userId: String(user?.preferredUsername),
						moduleName: ModuleName.UsePointsReports_setEditPointData,
					});
				},
				renderFn: () => (
					<span className={styles.context_menu_item}>
						<Edit className={styles.icon} />
						<span>Редактировать</span>
					</span>
				),
			},
			{
				name: 'Редактировать каналы и приборы',
				onClick: () => {
					openModal(RegisteredModals.EditPointLinkedChannels);
				},
				renderFn: () => (
					<span className={styles.context_menu_item}>
						<Edit className={styles.icon} />
						<span>Редактировать каналы и приборы</span>
					</span>
				),
			},
			{
				name: 'Удалить',
				onClick: () => {
					openModal(RegisteredModals.DeletePoint);
				},
				renderFn: () => (
					<span className={styles.context_menu_item}>
						<IconDelete className={styles.icon} />
						<span>Удалить</span>
					</span>
				),
			},
			{
				name: 'Добавить снизу',
				onClick: () => {
					const { id, energyResource } = selectedPoint as Point;
					setEditPointData({
						...editPointData,
						energyResource,
						prevId: id,
					});
					openModal(RegisteredModals.EditPoint);
				},
				renderFn: () => (
					<span className={styles.context_menu_item}>
						<Plus className={styles.icon} />
						<span>Добавить снизу</span>
					</span>
				),
			},
		],
		[contextMenuId, user, selectedPoint, points],
	);

	// Начальный запрос точек учета и энергоресурсов
	useEffect(() => {
		if (!user) return;
		fetchPointsListFx({
			energyResource: energyResourceId,
			userId: user.preferredUsername,
			moduleName: ModuleName.UsePointsReports_fetchPointsListFx,
		});
	}, [
		fetchPointsListFx,
		fetchEnergyResourcesListFx,
		user,
		energyResourceId,
		energyResources,
	]);

	// Эффект для фильтра данных при изменении любого фильтра шапки
	useEffect(() => {
		const pointsFilteredData = points.filter((point) => {
			for (const textFilter of Object.keys(searchData)) {
				if (
					!String(point[textFilter as keyof typeof point])
						.toLowerCase()
						.includes(
							searchData[textFilter as keyof typeof searchData].toLowerCase(),
						)
				)
					return false;
			}
			return (
				selectedLinkedOptions.includes(
					point.channelState as SelectedFilterOption,
				) &&
				selectedLinkedPointOptions.includes(point.linkedPointId ? 'Да' : 'Нет')
			);
		});
		const filteredTableData = pointsTableBodyAdapter(
			pointsFilteredData,
			onCollapse,
			changeIsActivePointEvent,
			onOpen,
			user?.preferredUsername ?? '',
		);

		const sortedData: ITableBody[] =
			sortFilter.order === SortOrder.None
				? filteredTableData
				: sortByOrder(filteredTableData, sortFilter.accessor, sortFilter.order);
		setPointsData(sortedData);
	}, [
		points,
		selectedLinkedOptions,
		selectedLinkedPointOptions,
		sortFilter,
		searchData,
	]);

	useEffect(() => {
		if (
			focusPointId &&
			pointsData.length === points.length &&
			points.length > 1
		) {
			const linkedPoint = document.getElementById(
				`linked-button-${focusPointId}`,
			);
			changeIsActivePointEvent({
				id: focusPointId,
				isActive: true,
			} as ActivePoint);
			linkedPoint?.scrollIntoView({
				block: 'center',
				behavior: 'smooth',
			});
			setFocusPointId(null);
		}
	}, [pointsData, focusPointId, points]);

	return {
		header,
		pointsData,
		onDragEnd,
		onOpen,
		position,
		setPosition,
		items,
	};
}
