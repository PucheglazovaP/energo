import { useCallback } from 'react';
import clsx from 'clsx';
import { useStore } from 'effector-react';

import { Search } from '../../Icons';
import { $accountingNode } from '../../Models/AccountingNode';
import { setAccountingNode } from '../../Models/AccountingNode/events';
import { $editLinkedParameter } from '../../Models/EditLinkedParameter';
import { setActiveLinkedParameterIdEvent } from '../../Models/EditLinkedParameter/events';
import { closeModal, openModal } from '../../Models/Modal/events';
import { $parameterByValueTable } from '../../Models/ParametersByValueReports';
import {
	setParameterTypeOptionsEvent,
	setSelectedParameterTypesEvent,
	setTableSearchFiltersEvent,
	setToggledSections,
} from '../../Models/ParametersByValueReports/events';
import { ParametersByValueList } from '../../Models/ParametersByValueReports/types';
import { RegisteredModals } from '../../Shared/modalsConfig';
import { FilterOptions } from '../../Shared/types';
import MultiselectDropdownSearchAndSortRender from '../../UI/MultiselectDropdown/MultiselectDropdownSearchAndSortRender';
import {
	Cell,
	ITableBody,
	ITableColumn,
	TableSection,
} from '../../UI/Table/types';
import {
	changeFilterOptions,
	getSelectedItemTypeNames,
} from '../../Utils/tableUtils';
import ReportTableRadioButtonCell from '../ReportTable/ReportTableRadioButtonCell';

import styles from '../../Containers/ParameterByValueTable/LinkedParameterTable.module.css';

function useLinkedParameter() {
	const { activeLinkedParameterId } = useStore($editLinkedParameter);
	const accountingNode = useStore($accountingNode);
	const {
		parametersList,
		searchFilters,
		parametersTypeOptions,
		selectedParameterTypes,
		isLoading,
		toggledSections,
	} = useStore($parameterByValueTable);

	// отфильтрованный список параметров по значениям в поисковых полях
	const getFilteredParametersBySearchFilters = useCallback(
		(initParameters: ParametersByValueList[]): ParametersByValueList[] => {
			const searchValuesCount: number = Object.values(searchFilters).filter(
				(item) => !!item,
			).length;

			// если поисковые поля не пустые
			if (searchValuesCount > 0) {
				const parametersFilteredData: ParametersByValueList[] =
					initParameters.filter((parameter) => {
						// счетчик совпадений для каждой точки
						let matchesCount = 0;

						for (const textFilter of Object.keys(searchFilters)) {
							if (
								!!searchFilters[textFilter as keyof typeof searchFilters] &&
								String(parameter[textFilter as keyof typeof parameter])
									.toLowerCase()
									.includes(
										searchFilters[
											textFilter as keyof typeof searchFilters
										].toLowerCase(),
									)
							)
								matchesCount += 1;
						}

						return matchesCount >= searchValuesCount;
					});

				return parametersFilteredData;
			}

			return initParameters;
		},
		[searchFilters],
	);

	// Отфильтрованный список параметров по признаку "Да/нет" в колонке "Связ. параметр"
	const filteredParametersBySelectedParameterType: ParametersByValueList[] =
		selectedParameterTypes.length > 0
			? parametersList.filter(({ linkedColumns }: ParametersByValueList) =>
					selectedParameterTypes.includes(linkedColumns ? 'Да' : 'Нет'),
			  )
			: parametersList;

	// фильтруем параметры по значениям в поисковых полях
	const filteredParametersBySearchFilters: ParametersByValueList[] =
		getFilteredParametersBySearchFilters(
			filteredParametersBySelectedParameterType,
		);

	// Формируем объект с 2 массивами - для ячеек и секций в таблице
	const { tableBody, sections } = filteredParametersBySearchFilters.reduce(
		(
			accumulator: { tableBody: ITableBody[]; sections: TableSection[] },
			parameter,
		) => {
			const { tableBody, sections } = accumulator;

			// Подготовить данные ячеек
			const dataLine: Cell[] = [
				{
					accessor: 'shortName',
					text: parameter.shortName,
					renderCell: () => (
						<ReportTableRadioButtonCell
							title={parameter.shortName}
							selected={parameter.parameterId === activeLinkedParameterId}
						/>
					),
				},
				{
					accessor: 'name',
					text: parameter.name,
					renderCell: () => (
						<span title={parameter.name}>{parameter.name}</span>
					),
				},
				{
					accessor: 'pointName',
					text: parameter.pointName,
					renderCell: () => (
						<span title={parameter.pointName}>{parameter.pointName}</span>
					),
				},
				{
					accessor: 'methodName',
					text: parameter.methodName,
					renderCell: () => (
						<span title={parameter.methodName}>{parameter.methodName}</span>
					),
				},
				{
					accessor: 'calcName',
					text: parameter.calcName,
					renderCell: () => (
						<span title={parameter.calcName}>{parameter.calcName}</span>
					),
				},
				{
					accessor: 'precision',
					text: parameter.precision,
					renderCell: () => (
						<span title={String(parameter.precision)}>
							{parameter.precision}
						</span>
					),
				},
				{
					accessor: 'hourShift',
					text: parameter.hourShift,
					renderCell: () => (
						<span title={String(parameter.hourShift)}>
							{parameter.hourShift}
						</span>
					),
				},
				{
					accessor: 'linkedColumns',
					text: parameter.linkedColumns ? 'Да' : 'Нет',
					className: clsx(
						styles.linked_cell,
						parameter.linkedColumns && styles.linked_cell__active,
					),
				},
			];

			// sectionAccessor нужен, чтобы работал аккордеон
			tableBody.push({
				dataLine,
				sectionAccessor: String(parameter.dailyPointGroupsId),
				rowClassName: clsx(
					styles.row,
					parameter.parameterId === activeLinkedParameterId &&
						styles.parameter__active,
				),
				onRowClick: () => {
					// устанавливаем активный связный параметр в модель
					setActiveLinkedParameterIdEvent(parameter.parameterId);
				},
			});

			// Подготовить данные секций
			// Родительская секция
			if (
				!sections.some(
					(item) =>
						item.sectionAccessor === String(parameter.dailyPointGroupsId),
				)
			) {
				sections.push({
					sectionAccessor: String(parameter.dailyPointGroupsId),
					text: parameter.visualizationGroupName,
					isExpanded: !toggledSections.includes(
						String(parameter.dailyPointGroupsId),
					),
					renderSection: (
						<div className={styles.section_title}>
							{parameter.visualizationGroupName}
							<p className={styles.text}>&nbsp;/ Группа визуализации</p>
						</div>
					),
				});
			}

			// Дочерняя секция
			if (
				!sections.some(
					(item) =>
						item.sectionAccessor === String(parameter.dailyPointGroupsId),
				)
			) {
				sections.push({
					sectionAccessor: 'shortName',
					parentAccessor: String(parameter.dailyPointGroupsId),
					text: parameter.pointName,
				});
			}

			return accumulator;
		},
		{ tableBody: [], sections: [] },
	);

	const handleExpandCollapseSection = (accessor: string) => {
		const indexOfToggledSection: number = toggledSections.indexOf(accessor);
		// если такая секция уже была в модели, то удаляем её
		if (indexOfToggledSection !== -1) {
			setToggledSections([
				...toggledSections.slice(0, indexOfToggledSection),
				...toggledSections.slice(indexOfToggledSection + 1),
			]);
		} else {
			// если такой секции не было в модели, то добавляем её
			setToggledSections([...toggledSections, accessor]);
		}
	};

	// Логика ввода данных в поисковое поле в заголовках таблицы
	const onSearchByColumn = (value: string, accessor: string) => {
		// Записываем в модель значения поисковой строки
		setTableSearchFiltersEvent({
			...searchFilters,
			[accessor]: value,
		});
	};

	// При клике на "Да/Нет" в колонке "Связ. параметр"
	const onSelectParameterFilterOption = (key: string) => {
		setParameterTypeOptionsEvent(
			changeFilterOptions(key, parametersTypeOptions),
		);
	};

	// При клике в фильтре на "Выбрать всё"
	const onAllSelect = () => {
		const isAnyOptionChecked: boolean = parametersTypeOptions.some(
			(item) => item.isChecked,
		);

		setParameterTypeOptionsEvent(
			parametersTypeOptions.map((item: FilterOptions) => ({
				...item,
				isChecked: !isAnyOptionChecked,
			})),
		);
	};

	// При клике на "Применить" в фильтре в колонке "Связ. параметр"
	const onApplyParameterOptions = () => {
		setSelectedParameterTypesEvent(
			getSelectedItemTypeNames(parametersTypeOptions),
		);
	};

	// Формируем шапку таблицы
	const header: ITableColumn[] = [
		{
			accessor: 'shortName',
			text: 'Короткое наименование',
			isResizable: true,
			sortOrder: 0,
			width: 450,
			renderHeaderCell: MultiselectDropdownSearchAndSortRender({
				placeholder: 'Короткое наименование',
				searchValue: searchFilters.shortName,
				onSearch: (value: string) => onSearchByColumn(value, 'shortName'),
				isSearchable: true,
				glyph: <Search className={styles.search_icon} />,
				className: styles.header_searchable,
			}),
		},
		{
			accessor: 'name',
			text: 'Полное наименование',
			isResizable: true,
			sortOrder: 0,
			width: 450,
			renderHeaderCell: MultiselectDropdownSearchAndSortRender({
				placeholder: 'Полное наименование',
				searchValue: searchFilters.name,
				onSearch: (value: string) => onSearchByColumn(value, 'name'),
				isSearchable: true,
				glyph: <Search className={styles.search_icon} />,
				className: styles.header_searchable,
			}),
		},
		{
			accessor: 'pointName',
			text: 'Базовая ТУ',
			isResizable: true,
			sortOrder: 0,
			width: 160,
			renderHeaderCell: MultiselectDropdownSearchAndSortRender({
				placeholder: 'Базовая ТУ',
				searchValue: searchFilters.pointName,
				onSearch: (value: string) => onSearchByColumn(value, 'pointName'),
				isSearchable: true,
				glyph: <Search className={styles.search_icon} />,
				className: styles.header_searchable,
			}),
		},
		{
			accessor: 'methodName',
			text: 'Метод обработки',
			isResizable: true,
			sortOrder: 0,
		},
		{
			accessor: 'calcName',
			text: 'Способ вычисления',
			isResizable: true,
			sortOrder: 0,
		},
		{
			accessor: 'precision',
			text: 'Округление',
			isResizable: true,
			sortOrder: 0,
		},
		{
			accessor: 'hourShift',
			text: 'Сдвиг в часах',
			isResizable: true,
			sortOrder: 0,
		},
		{
			accessor: 'linkedColumns',
			text: 'Связ. параметр',
			isResizable: true,
			sortOrder: 0,
			minWidth: 140,
			width: 140,
			renderHeaderCell: MultiselectDropdownSearchAndSortRender({
				title: 'Связ. параметр',
				hasFilterControl: true,
				classNameFilterControl: styles.filter_control,
				onApply: onApplyParameterOptions,
				items: parametersTypeOptions,
				onSelect: onSelectParameterFilterOption,
				onSelectAll: onAllSelect,
				isSearchBoxVisible: false,
				className: styles.header_searchable,
			}),
		},
	];

	const onCancel = () => {
		closeModal(RegisteredModals.LinkedParameter);
		openModal(RegisteredModals.AccountingNodeModal);
	};

	const onConfirm = () => {
		setAccountingNode({
			...accountingNode,
			linkedDailyPointsId: activeLinkedParameterId,
		});
		closeModal(RegisteredModals.LinkedParameter);
		openModal(RegisteredModals.AccountingNodeModal);
	};

	return {
		header,
		linkedParameterData: tableBody,
		isLoading,
		sections,
		handleExpandCollapseSection,
		onCancel,
		onConfirm,
	};
}

export default useLinkedParameter;
