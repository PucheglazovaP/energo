import React, { useCallback, useEffect, useState } from 'react';
import clsx from 'clsx';
import { useStore } from 'effector-react';

import linkedPointsTableAdapter from '../../Adapters/Points/linkedPointsTableAdapter';
import { Comment, Filter, Search } from '../../Icons';
import {
	$editPointData,
	$points,
	$pointsSortFilter,
} from '../../Models/Points';
import {
	changeIsActivePointEvent,
	setPointsTableSortFilterEvent,
} from '../../Models/Points/events';
import {
	Accessors,
	SearchTextName,
	SearchTextParams,
	SelectedFilterOption,
} from '../../Models/Points/types';
import { FilterOptions, SortOrder } from '../../Shared/types';
import FilterControl from '../../UI/MultiselectDropdown/MultiselectDropdown';
import MultiselectDropdownSearchAndSortRender from '../../UI/MultiselectDropdown/MultiselectDropdownSearchAndSortRender';
import { ITableBody, ITableColumn } from '../../UI/Table/types';
import { getSortOrder, sortByOrder } from '../../Utils/tableUtils';

import { EditLinkedPointFormFrom } from './types';
import { useEditLinkedPointConfirmations } from './useEditLinkedPointConfirmations';

import styles from './EditLinkedPointForm.module.css';

export function useEditLinkedPointForm(from: EditLinkedPointFormFrom) {
	const points = useStore($points);
	const editPointData = useStore($editPointData);
	const activeLinkedPoint = editPointData.linkedPointId || null;
	const [selectedPoint, setSelectedPoint] = useState<number | null>(null);
	const { handleSubmit, handleCloseModal } = useEditLinkedPointConfirmations(
		from,
		selectedPoint,
	);

	/* Текущие отсортированные и преоборазованные данные. Изначально изначально все данные points */
	const [pointsData, setPointsData] = useState<ITableBody[]>([]);

	const sortFilter = useStore($pointsSortFilter);

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

	const header: ITableColumn[] = [
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
			minWidth: 120,
			renderHeaderCell: () => (
				<div className={styles.filter_wrapper}>
					<span>Связ. канал</span>
					<FilterControl
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
					<span>Связ. канал</span>
					<FilterControl
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

	const handleSelectPoint = useCallback(
		(id: number) => {
			setSelectedPoint(id);
		},
		[setSelectedPoint],
	);

	useEffect(() => {
		setSelectedPoint(activeLinkedPoint);
	}, [activeLinkedPoint]);

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
		const filteredTableData = linkedPointsTableAdapter(
			pointsFilteredData,
			changeIsActivePointEvent,
			handleSelectPoint,
			selectedPoint,
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
		selectedPoint,
	]);

	return {
		handleCloseModal,
		handleSubmit,
		handleSelectPoint,
		editPointData,
		header,
		pointsData,
	};
}
