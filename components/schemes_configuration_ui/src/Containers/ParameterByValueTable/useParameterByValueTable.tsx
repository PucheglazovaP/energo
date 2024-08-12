import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import clsx from 'clsx';
import { useStore } from 'effector-react';

import {
	ArrowDown,
	ArrowsOpposite,
	ArrowUp,
	Close,
	Edit,
	Info,
	Plus,
	Search,
} from '../../Icons';
import { INITIAL_ACCOUNTING_NODE } from '../../Models/AccountingNode';
import {
	getAccountingNodeCalculateMethods,
	getAccountingNodeMethods,
} from '../../Models/AccountingNode/effects';
import {
	setAccountingNode,
	setAccountingNodeCalculateMethodActive,
	setAccountingNodeId,
	setAccountingNodeMethodActive,
} from '../../Models/AccountingNode/events';
import { $user } from '../../Models/Auth';
import { $energyResourceId } from '../../Models/EnergyResources';
import { openModal } from '../../Models/Modal/events';
import { $parameterByValueTable } from '../../Models/ParametersByValueReports';
import {
	getParametersByValueListFx,
	moveParametersSortOrderFx,
} from '../../Models/ParametersByValueReports/effects';
import {
	setModalLinkedPointIdEvent,
	setParameterTypeOptionsEvent,
	setSelectedParameterTypesEvent,
	setTableSearchFiltersEvent,
	setToggledSections,
} from '../../Models/ParametersByValueReports/events';
import { ParametersByValueList } from '../../Models/ParametersByValueReports/types';
import { INITIAL_EDIT_POINT } from '../../Models/Points';
import { fetchPointsListFx } from '../../Models/Points/effects';
import { setEditPointData } from '../../Models/Points/events';
import { $visualizationGroupsTable } from '../../Models/VisualizationGroups';
import { moveVisualizationGroupSortOrderFx } from '../../Models/VisualizationGroups/effects';
import { setActiveVisualizationGroupIdEvent } from '../../Models/VisualizationGroups/events';
import { VisualizationGroupList } from '../../Models/VisualizationGroups/types';
import { RegisteredModals } from '../../Shared/modalsConfig';
import { FilterOptions } from '../../Shared/types';
import { ModuleName } from '../../Shared/Types/moduleName';
import {
	ContextMenuItem,
	ContextMenuPosition,
} from '../../UI/ContextMenu/types';
import MultiselectDropdownSearchAndSortRender from '../../UI/MultiselectDropdown/MultiselectDropdownSearchAndSortRender';
import { IconDelete } from '../../UI/Parameter/iconEditing';
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

import styles from '../../Containers/ParameterByValueTable/ParameterByValueTable.module.css';

function useParameterByValueTable() {
	const user = useStore($user);
	const { visualizationGroups } = useStore($visualizationGroupsTable);
	const energyResourceId = useStore($energyResourceId);
	const {
		parametersList,
		searchFilters,
		parametersTypeOptions,
		selectedParameterTypes,
		isLoading,
		toggledSections,
	} = useStore($parameterByValueTable);

	// стор положения контекстного меню
	const [position, setPosition] = useState<ContextMenuPosition | null>(null);

	// id элемента, вызванного через контекстного меню
	const [currentItemId, setCurrentItemId] = useState<number>(0);

	// id параметра, вызванного для переноса через контекстного меню
	const [draggableItemId, setDraggableItemId] = useState<number>(0);

	// id параметра, вызванного для переноса через контекстного меню
	const [droppableParameterGroupId, setDroppableParameterGroupId] =
		useState<number>(0);

	// флаг, когда кликнули на секцию
	const [isClickedSection, setClickedSection] = useState<boolean>(false);

	// флаг, когда в контекстном меню нажали "Переместить" (днд) для секций
	const [isSectionDndMode, setSectionDndMode] = useState<boolean>(false);

	// флаг, когда в контекстном меню нажали "Переместить" (днд) для параметров(дочерних элементов)
	const [isTableDndMode, setTableDndMode] = useState<boolean>(false);

	// открыть модальное окно "Связанной точки учета"
	const handleBasePointClick = useCallback(
		(linkedPointId: number | null, energyResourceId: number) => async () => {
			if (!user) return;
			setModalLinkedPointIdEvent(linkedPointId);
			await fetchPointsListFx({
				energyResource: energyResourceId,
				pointId: linkedPointId,
				userId: user.preferredUsername,
				moduleName: ModuleName.UseParameterByValueTable_fetchPointsListFx,
			});
			openModal(RegisteredModals.LinkedPointModal);
		},
		[user],
	);

	// получение предыдущего параметра по текущему выбранному через контекстное меню id параметра
	const getPreviousParameterId = useCallback(
		(currentId: number): number => {
			// находим выбранный параметр в списке параметров
			const currentParameter: ParametersByValueList | undefined =
				parametersList.find((parameter) => parameter.parameterId === currentId);

			// если такого параметра нет, то вернуть 0 (вместо undefined)
			if (!currentParameter || !currentParameter.parameterId) {
				return 0;
			}

			/* id параметра, после которого нужно поставить.
      То есть предыдущий параметр в таблице, относительно того,
      на котором вызвали контекстное меню и нажали "Вставить выше" */
			const previousParameter: ParametersByValueList | undefined =
				parametersList.find(
					(parameter) => parameter.sortOrder === currentParameter.sortOrder - 1,
				);

			/* если предыдущего параметра нет, то вернуть 0,
       чтобы поставить элемент в начало списка" */
			if (!previousParameter || !previousParameter.parameterId) {
				return 0;
			}

			return previousParameter.parameterId;
		},
		[parametersList],
	);

	// получение предыдущей группы визуализации по текущему выбранному id параметра через контекстное меню
	const getPreviousVisualizationGroupId = useCallback(
		(currentId: number): number => {
			// находим выбранный параметр в списке параметров
			const currentVisualizationGroup: ParametersByValueList | undefined =
				parametersList.find(
					(parameter) => parameter.dailyPointGroupsId === currentId,
				);

			// если такого параметра нет, то вернуть 0 (вместо undefined)
			if (
				!currentVisualizationGroup ||
				!currentVisualizationGroup.dailyPointGroupsId
			) {
				return 0;
			}

			/* id группы визуализации, после которого нужно поставить.
      То есть предыдущая группа визуализации в таблице, относительно той,
      на которой вызвали контекстное меню и нажали "Вставить выше" */
			const previousVisualizationGroup: ParametersByValueList | undefined =
				parametersList.find(
					(parameter) =>
						parameter.sortOrderGroup ===
						currentVisualizationGroup.sortOrderGroup - 1,
				);

			/* если предыдущей группы визуализации нет, то вернуть 0,
       чтобы поставить элемент в начало списка" */
			if (
				!previousVisualizationGroup ||
				!previousVisualizationGroup.dailyPointGroupsId
			) {
				return 0;
			}

			return previousVisualizationGroup.dailyPointGroupsId;
		},
		[parametersList],
	);

	// выбранный через контекстное меню dailyPointGroupsId параметра по текущему выбранному id параметра
	const getCurrentGroupId = useCallback(
		(currentId: number): number => {
			const currentParameter: ParametersByValueList | undefined =
				parametersList.find((parameter) => parameter.parameterId === currentId);

			if (!currentParameter || !currentParameter.dailyPointGroupsId) {
				return 0;
			}

			return currentParameter.dailyPointGroupsId;
		},
		[parametersList],
	);

	// выбранный через контекстное меню параметр для перемещения
	const getDraggableParameterLastModified = useCallback(
		(draggableId: number): string => {
			const currentParameter: ParametersByValueList | undefined =
				parametersList.find(
					(parameter) => parameter.parameterId === draggableId,
				);

			if (!currentParameter || !currentParameter.lastModified) {
				return '';
			}

			return currentParameter.lastModified;
		},
		[parametersList],
	);

	// выбранная через контекстное меню группа визуализации для перемещения
	const getDraggableVisualizationGroupLastModified = useCallback(
		(draggableId: number): string => {
			const currentVisualizationGroup: VisualizationGroupList | undefined =
				visualizationGroups.find(
					(visualizationGroup) =>
						visualizationGroup.visualizationGroupId === draggableId,
				);

			if (
				!currentVisualizationGroup ||
				!currentVisualizationGroup.lastModified
			) {
				return '';
			}

			return currentVisualizationGroup.lastModified;
		},
		[visualizationGroups],
	);

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

	// отфильтрованный список параметров по признаку "Да/нет" в колонке "Связ. параметр"
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

	// формируем объект с 2 массивами - для ячеек и секций в таблице
	const {
		tableBody,
		sections,
	}: { tableBody: ITableBody[]; sections: TableSection[] } =
		filteredParametersBySearchFilters.reduce(
			(
				accumulator: { tableBody: ITableBody[]; sections: TableSection[] },
				parameter,
			) => {
				const {
					tableBody,
					sections,
				}: { tableBody: ITableBody[]; sections: TableSection[] } = accumulator;

				// подготовить данные ячеек
				const dataLine: Cell[] = [
					{
						accessor: 'shortName',
						text: parameter.shortName,
						renderCell: () => (
							<span title={parameter.shortName}>{parameter.shortName}</span>
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
							<div title={parameter.pointName} className={styles.base_point}>
								<button
									onClick={handleBasePointClick(
										parameter.pointId,
										parameter.energyResourceId,
									)}
								>
									<Info className={styles.info_icon} />
								</button>
								<span>{parameter.pointName}</span>
							</div>
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
					onContextMenu: (evt: React.MouseEvent) => {
						onOpen(evt, Number(parameter.parameterId), 'table');
					},
					rowClassName: clsx(
						parameter.parameterId === currentItemId && styles.parameter__active,
						parameter.parameterId === draggableItemId &&
							styles.parameter__active,
						parameter.dailyPointGroupsId !== droppableParameterGroupId &&
							isTableDndMode &&
							/* это css-класс добавляется в tr других секций,
               куда дроп выбранного для перемещения элемента невозможен
               и поэтому там запрещён ховер этих tr */
							styles.undroppable,
						isSectionDndMode && styles.undroppable,
					),
				});

				// родительская секция
				if (
					!sections.some(
						(item) =>
							item.sectionAccessor === String(parameter.dailyPointGroupsId),
					)
				) {
					sections.push({
						sectionAccessor: String(parameter.dailyPointGroupsId),
						text: parameter.visualizationGroupName,
						isExpanded: toggledSections.includes(
							String(parameter.dailyPointGroupsId),
						),
						className: clsx(
							isTableDndMode && styles.undroppable_section,
							// чтобы секция была выделена, если она выбрана для днд
							parameter.dailyPointGroupsId === currentItemId &&
								styles.parameter__active,
							parameter.dailyPointGroupsId === draggableItemId &&
								styles.parameter__active,
						),
						onContextMenu: (evt: React.MouseEvent) => {
							onOpen(evt, Number(parameter.dailyPointGroupsId), 'section');
						},
						renderSection: (
							<div className={styles.section_title}>
								{parameter.visualizationGroupName}
								<p className={styles.text}>&nbsp;/ Группа визуализации</p>
							</div>
						),
					});
				}

				// дочерняя секция
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

	// логика ввода данных в поисковое поле в заголовках таблицы
	const onSearchByColumn = (value: string, accessor: string) => {
		// записываем в модель значения поисковой строки
		setTableSearchFiltersEvent({
			...searchFilters,
			[accessor]: value,
		});
	};

	// при клике на "Да/Нет" в колонке "Связ. параметр"
	const onSelectParameterFilterOption = (key: string) => {
		setParameterTypeOptionsEvent(
			changeFilterOptions(key, parametersTypeOptions),
		);
	};

	// при клике в фильтре на "Выбрать всё"
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

	// при клике на "Применить" в фильтре в колонке "Связ. параметр"
	const onApplyParameterOptions = () => {
		setSelectedParameterTypesEvent(
			getSelectedItemTypeNames(parametersTypeOptions),
		);
	};

	// формируем шапку таблицы
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

	// колбек открытия контекстного меню
	const onOpen = useCallback(
		(evt: React.MouseEvent, id: number, role: string) => {
			evt.preventDefault();
			setPosition({ x: evt.pageX, y: evt.pageY });
			setCurrentItemId(id);

			// при клике на секцию
			if (role === 'section') {
				setClickedSection(true);

				// если в режиме днд таблиц кликнули на секцию, то выводим предупреждение
				if (isTableDndMode) {
					toast.warn(
						'Перенос параметра возможен только между другими параметрами внутри его группы',
					);
				}
			}

			// при клике на вложенные элементы (ряд в таблице)
			if (role === 'table') {
				setClickedSection(false);
				if (isSectionDndMode) {
					toast.warn(
						'Перемещение группы возможно только между другими группами, но не внутрь одной из них',
					);
				}

				if (
					isTableDndMode &&
					droppableParameterGroupId !== getCurrentGroupId(id)
				) {
					toast.warn(`Перенос параметра в другие группы невозможен`);
				}
			}
		},
		[
			droppableParameterGroupId,
			getCurrentGroupId,
			isSectionDndMode,
			isTableDndMode,
		],
	);

	// запрос на изменение порядка в таблице
	const onMoveItems = useCallback(
		// fromId айдишник элемента, который двигаем
		// toId айдишник элемента, после которого ставим
		async (fromId: number, toId: number, lastModified: string) => {
			if (!user) return;
			isSectionDndMode
				? moveVisualizationGroupSortOrderFx({
						fromId,
						/* если dailyPointGroupsId <= 0, ставим 0,
						чтобы переместить выбранную группу в начало списка (как описано в процедуре) */
						toId: toId <= 0 ? 0 : toId,
						lastModified,
						userId: user.preferredUsername,
						moduleName:
							ModuleName.UseParameterByValueTable_moveVisualizationGroupSortOrderFx,
				  })
				: moveParametersSortOrderFx({
						fromId,
						toId,
						lastModified,
						userId: user.preferredUsername,
						moduleName:
							ModuleName.UseParameterByValueTable_moveParametersSortOrderFx,
				  });
		},
		[isSectionDndMode, user],
	);

	const clearDndParams = () => {
		setCurrentItemId(0);
		setDraggableItemId(0);
		setDroppableParameterGroupId(0);
		setClickedSection(false);
		setSectionDndMode(false);
		setTableDndMode(false);
	};

	// пункты контекстного меню
	const items: ContextMenuItem[] = useMemo(() => {
		const handleEdit = () => {
			setAccountingNodeId(currentItemId);
			openModal(RegisteredModals.AccountingNodeModal);
		};

		const handleCreate = () => {
			setAccountingNodeId(null);
			setAccountingNode(INITIAL_ACCOUNTING_NODE);
			setAccountingNodeMethodActive(1);
			setAccountingNodeCalculateMethodActive(1);
			setActiveVisualizationGroupIdEvent(null);
			setEditPointData(INITIAL_EDIT_POINT);
			openModal(RegisteredModals.AccountingNodeModal);
		};

		const handleDelete = () => {
			setAccountingNodeId(currentItemId);
			openModal(RegisteredModals.DeleteParameter);
		};

		const handleInsertAbove = () => {
			isSectionDndMode
				? onMoveItems(
						draggableItemId,
						getPreviousVisualizationGroupId(currentItemId),
						getDraggableVisualizationGroupLastModified(draggableItemId),
				  )
				: onMoveItems(
						draggableItemId,
						getPreviousParameterId(currentItemId),
						getDraggableParameterLastModified(draggableItemId),
				  );

			clearDndParams();
		};

		const handleInsertBelow = () => {
			isSectionDndMode
				? onMoveItems(
						draggableItemId,
						currentItemId,
						getDraggableVisualizationGroupLastModified(draggableItemId),
				  )
				: onMoveItems(
						draggableItemId,
						currentItemId,
						getDraggableParameterLastModified(draggableItemId),
				  );

			clearDndParams();
		};

		const handleCancelMove = () => {
			// выключаем режим днд секций/таблиц
			setClickedSection(false);
			setSectionDndMode(false);
			setTableDndMode(false);
			// убираем выделение строки обнуляя id элемента, на котором вызывалось контекстное меню
			setCurrentItemId(0);
			// обнуляем id передвигаемого элемента
			setDraggableItemId(0);
			// обнуляем id куда можно дропать элемент
			setDroppableParameterGroupId(0);
		};

		const addNewItem: ContextMenuItem = {
			name: 'Добавить новый параметр',
			onClick: handleCreate,
			renderFn: () => (
				<span className={styles.context_menu_item}>
					<Plus className={styles.icon} />
					<span>Добавить новый параметр</span>
				</span>
			),
			isDisabled: isTableDndMode,
		};

		const editItem: ContextMenuItem = {
			name: 'Редактировать',
			onClick: handleEdit,
			renderFn: () => (
				<span className={styles.context_menu_item}>
					<Edit className={styles.icon} />
					<span>Редактировать</span>
				</span>
			),
			isDisabled: isTableDndMode,
		};

		const deleteItem: ContextMenuItem = {
			name: 'Удалить',
			onClick: handleDelete,
			renderFn: () => (
				<span className={styles.context_menu_item}>
					<IconDelete className={styles.icon} />
					<span>Удалить</span>
				</span>
			),
			withSeparator: true,
			isDisabled: isTableDndMode,
		};

		const createRowWithDnd: ContextMenuItem = {
			name: 'Отменить перенос ',
			onClick: handleCancelMove,
			renderFn: () => (
				<span className={styles.context_menu_item}>
					<Close className={styles.icon} />
					<span>Отменить перенос</span>
				</span>
			),
			isNotCloseOnClick: true,
		};

		const createRowWithoutDnd: ContextMenuItem = {
			name: 'Переместить ',
			onClick: () => {
				// запоминаем id кликнутого элемента, чтобы потом его переместить
				setDraggableItemId(currentItemId);

				/* если кликнули по таблице, то запоминаем группу, в которой выбрали элемент,
				чтобы потом её сравнить с той, куда планируем переместить.
				И, если это будет не та, то вывести предупреждение */
				if (!isClickedSection) {
					setDroppableParameterGroupId(getCurrentGroupId(currentItemId));
				}
				// если изначально был клик по секции, то включаем днд для секций, если нет, то для таблиц
				isClickedSection ? setSectionDndMode(true) : setTableDndMode(true);
			},
			renderFn: () => (
				<span className={styles.context_menu_item}>
					<ArrowsOpposite className={styles.icon} />
					<span>Переместить</span>
				</span>
			),
		};

		const insertAboveItem: ContextMenuItem = {
			name: 'Вставить выше',
			onClick: handleInsertAbove,
			renderFn: () => (
				<span className={styles.context_menu_item}>
					<ArrowUp className={styles.icon} />
					<span>Вставить выше</span>
				</span>
			),
			isDisabled: isClickedSection
				? !isSectionDndMode || currentItemId === draggableItemId
				: !isTableDndMode ||
				  droppableParameterGroupId !== getCurrentGroupId(currentItemId) ||
				  currentItemId === draggableItemId,
		};

		const insertBelowItem: ContextMenuItem = {
			name: 'Вставить ниже',
			onClick: handleInsertBelow,
			renderFn: () => (
				<span className={styles.context_menu_item}>
					<ArrowDown className={styles.icon} />
					<span>Вставить ниже</span>
				</span>
			),
			isDisabled: isClickedSection
				? !isSectionDndMode || currentItemId === draggableItemId
				: !isTableDndMode ||
				  droppableParameterGroupId !== getCurrentGroupId(currentItemId) ||
				  currentItemId === draggableItemId,
		};

		// набор пунктов контекстного меню в режиме днд родительских элементов
		const sectionDndItems: ContextMenuItem[] = [
			isSectionDndMode ? createRowWithDnd : createRowWithoutDnd,
			insertAboveItem,
			insertBelowItem,
		];

		// набор пунктов контекстного меню в режиме днд дочерних элементов
		const tableDndItems: ContextMenuItem[] = [
			addNewItem,
			editItem,
			deleteItem,
			isTableDndMode ? createRowWithDnd : createRowWithoutDnd,
			insertAboveItem,
			insertBelowItem,
		];

		// набор контекстного меню в зависимости от режима днд
		const currentItems: ContextMenuItem[] =
			isClickedSection || isSectionDndMode ? sectionDndItems : tableDndItems;

		return currentItems;
	}, [
		isTableDndMode,
		isClickedSection,
		isSectionDndMode,
		currentItemId,
		draggableItemId,
		droppableParameterGroupId,
		getCurrentGroupId,
		onMoveItems,
		getPreviousVisualizationGroupId,
		getDraggableVisualizationGroupLastModified,
		getPreviousParameterId,
		getDraggableParameterLastModified,
	]);

	// получение списка показателей отчетов при загрузке страницы
	useEffect(() => {
		if (!user) return;
		getParametersByValueListFx({
			energyResourceId,
			userId: user.preferredUsername,
			moduleName:
				ModuleName.UseParameterByValueTable_getParametersByValueListFx,
		});
		// обнуляем все фильтры
		setToggledSections([]);
		setSelectedParameterTypesEvent([]);
		setTableSearchFiltersEvent({
			shortName: '',
			name: '',
			pointName: '',
		});
		setSelectedParameterTypesEvent([]);
		clearDndParams();
	}, [energyResourceId, user]);

	useEffect(() => {
		if (!user) return;
		getAccountingNodeMethods({
			userId: user.preferredUsername,
			moduleName: ModuleName.UseParameterByValueTable_getAccountingNodeMethods,
		});
		getAccountingNodeCalculateMethods({
			userId: user.preferredUsername,
			moduleName:
				ModuleName.UseParameterByValueTable_getAccountingNodeCalculateMethods,
		});
	}, [user]);

	return {
		header,
		parameterByValueData: tableBody,
		isLoading,
		sections,
		handleExpandCollapseSection,
		items,
		position,
		setPosition,
	};
}

export default useParameterByValueTable;
