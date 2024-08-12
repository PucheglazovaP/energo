import { useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import clsx from 'clsx';
import { useStore } from 'effector-react';

import { Search } from '../../Icons';
import { $user } from '../../Models/Auth';
import { $deviceReports } from '../../Models/DeviceReports';
import {
	getDeviceReportsFx,
	getDevicesListFx,
} from '../../Models/DeviceReports/effects';
import {
	setActiveDeviceIdEvent,
	setDeviceTypeOptionsEvent,
	setSelectedDeviceTypesEvent,
	setTableSearchFiltersEvent,
	setTableSortFilterEvent,
} from '../../Models/DeviceReports/events';
import { DevicesList } from '../../Models/DeviceReports/types';
import { FilterOptions, SearchParameters, SortOrder } from '../../Shared/types';
import MultiselectDropdownSearchAndSortRender from '../../UI/MultiselectDropdown/MultiselectDropdownSearchAndSortRender';
import { ITableBody, ITableColumn } from '../../UI/Table/types';
import { updateSearchParams } from '../../Utils/searchParams';
import {
	changeFilterOptions,
	getFinalTableBodyData,
	getSelectedItemTypeNames,
	getSortOrder,
	isMatchRegExp,
} from '../../Utils/tableUtils';

import { searchInterfaceFieldPattern } from './constants';
import ReportTableRadioButtonCell from './ReportTableRadioButtonCell';
import { Accessors } from './types';
import { getSelectedReportType } from './utils';

import styles from '../../Containers/ReportTable/ReportTable.module.css';

export default function useReportTable() {
	const user = useStore($user);
	const {
		devicesList,
		activeDeviceId,
		reportTypes,
		sortFilter,
		searchFilters,
		isLoading,
		deviceTypeOptions,
		selectedDeviceTypes,
	} = useStore($deviceReports);
	const [searchParams, setSearchParams] = useSearchParams();

	// Отфильтрованный список приборов по именам выбранных приборов
	const filteredDevicesBySelectedDeviceTypes: DevicesList[] =
		selectedDeviceTypes.length > 0
			? devicesList.filter(({ deviceType }: DevicesList) =>
					selectedDeviceTypes.includes(deviceType),
			  )
			: devicesList;

	// Формируем данные для тела таблицы
	const tableBody: ITableBody[] = filteredDevicesBySelectedDeviceTypes.map(
		(list: DevicesList) => ({
			id: list.deviceId,
			dataLine: [
				{
					accessor: 'interface',
					text: list.deviceId,
					renderCell: () => (
						<ReportTableRadioButtonCell
							title={String(list.deviceId)}
							selected={list.deviceId === activeDeviceId}
						/>
					),
				},
				{
					accessor: 'accounting',
					text: list.device,
					renderCell: () => <span title={list.device}>{list.device}</span>,
				},
				{
					accessor: 'status',
					text: list.deviceType,
					renderCell: () => (
						<span title={list.deviceType}>{list.deviceType}</span>
					),
				},
			],
			rowClassName: clsx(
				styles.row,
				list.deviceId === activeDeviceId && styles.device__active,
			),
			onRowClick: () => {
				// устанавливаем показатели активного прибора в модель
				setActiveDeviceIdEvent(list.deviceId);
				const updatedSearchParams: URLSearchParams = updateSearchParams(
					searchParams,
					{
						deviceId: list.deviceId,
					},
				);
				setSearchParams(updatedSearchParams);
			},
		}),
	);

	// Логика ввода данных в поисковое поле в заголовках таблицы
	const onSearchByColumn = (value: string, accessor: string) => {
		// Записываем в модель значения поисковой строки
		setTableSearchFiltersEvent({
			...searchFilters,
			[accessor]: value,
		});
	};

	// Логика клика на сортировку в заголовках таблицы
	const handleSortOptions = (accessor: string) => {
		if (sortFilter.accessor === accessor) {
			const order: SortOrder = getSortOrder(sortFilter.order);
			setTableSortFilterEvent({ accessor, order });
		} else {
			setTableSortFilterEvent({
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

	// При клике на прибор в фильтре по типу прибора колонки таблицы
	const onSelectDeviceFilterOption = (key: string) => {
		setDeviceTypeOptionsEvent(changeFilterOptions(key, deviceTypeOptions));
	};

	// При клике в фильтре на "Выбрать всё"
	const onAllSelect = () => {
		const isAnyOptionChecked: boolean = deviceTypeOptions.some(
			(item) => item.isChecked,
		);

		setDeviceTypeOptionsEvent(
			deviceTypeOptions.map((item: FilterOptions) => ({
				...item,
				isChecked: !isAnyOptionChecked,
			})),
		);
	};

	/* При клике на "Применить" в фильтре по типу прибора формируем
	 массив имен выбранных приборов по выбранным опциям в фильтре */
	const onApplyDeviceOptions = () => {
		setSelectedDeviceTypesEvent(getSelectedItemTypeNames(deviceTypeOptions));
	};

	// Формируем шапку таблицы
	const header: ITableColumn[] = [
		{
			accessor: 'interface',
			text: 'Интерфейс',
			isResizable: true,
			isSortable: false,
			sortOrder: 0,
			width: 80,
			renderHeaderCell: MultiselectDropdownSearchAndSortRender({
				placeholder: 'Поиск...',
				searchValue: searchFilters.interface,
				onSearch: (value: string) => {
					// Если введённый символ соответствует шаблону регулярного выражения для этой колонки
					if (isMatchRegExp(value, searchInterfaceFieldPattern)) {
						onSearchByColumn(value, 'interface');
					}
					// В случае, если стерли последний символ в поисковый строке
					if (value === '') {
						onSearchByColumn(value, 'interface');
					}
				},
				isSearchable: true,
				glyph: <Search className={styles.search_icon} />,
				className: styles.header_searchable,
				isSortable: true,
				onSortClick: handleSortOptions,
				accessor: 'interface',
				sortClassName: clsx(getSortStyles('interface')),
			}),
		},
		{
			accessor: 'accounting',
			text: 'Порт:Линия:Скорость:Четность',
			isResizable: true,
			isSortable: false,
			sortOrder: 0,
			minWidth: 100,
			width: 200,
			renderHeaderCell: MultiselectDropdownSearchAndSortRender({
				placeholder: 'Точка учёта',
				searchValue: searchFilters.accounting,
				onSearch: (value: string) => onSearchByColumn(value, 'accounting'),
				isSearchable: true,
				glyph: <Search className={styles.search_icon} />,
				className: styles.header_searchable,
			}),
		},
		{
			accessor: 'status',
			text: 'Статус',
			isResizable: true,
			isSortable: false,
			sortOrder: 0,
			minWidth: 70,
			width: 70,
			renderHeaderCell: MultiselectDropdownSearchAndSortRender({
				title: 'Тип прибора',
				isSearchable: false,
				isSortable: true,
				onSortClick: handleSortOptions,
				accessor: 'status',
				sortClassName: clsx(getSortStyles('status')),
				hasFilterControl: true,
				className: styles.header_searchable,
				classNameFilterControl: styles.filter_control,
				// Отфильтровать данные таблицы по выбранным в фильтре приборам
				onApply: onApplyDeviceOptions,
				// Список всех приборов в фильтре по типу прибора
				items: deviceTypeOptions,
				// При клике на прибор в фильтре по типу прибора
				onSelect: onSelectDeviceFilterOption,
				// При клике на кнопку "Выбрать всё"
				onSelectAll: onAllSelect,
			}),
		},
	];

	// Отправка двух эффектов для загрузки данных из БД при первой загрузке страницы
	useEffect(() => {
		if (!user) return;
		getDeviceReportsFx({
			reportType: Number(getSelectedReportType(reportTypes)),
			userId: user.preferredUsername,
		});
		getDevicesListFx({
			reportType: Number(getSelectedReportType(reportTypes)),
			reportId: 'Строка 1',
			userId: user.preferredUsername,
		});
	}, [reportTypes, user]);

	useEffect(() => {
		const paramDeviceId = searchParams.get(SearchParameters.DeviceId);
		const deviceId: number | undefined = paramDeviceId
			? Number(paramDeviceId)
			: undefined;
		if (deviceId) setActiveDeviceIdEvent(Number(deviceId));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const reportData = getFinalTableBodyData(
		tableBody,
		searchFilters,
		sortFilter,
	);

	const activeRow = useMemo(() => {
		const activeIndex = reportData.findIndex(
			(item) => item.id === activeDeviceId,
		);
		return activeIndex;
	}, [reportData, activeDeviceId]);

	return {
		reportData,
		header,
		isLoading,
		activeRow,
	};
}
