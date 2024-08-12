import React, { useEffect, useState } from 'react';
import { Tooltip } from '@evraz/ui-kit';
import clsx from 'clsx';
import { format } from 'date-fns';
import { useStore } from 'effector-react';

import { Comment } from '../../Icons';
import ChartIcon from '../../Icons/Chart';
import { $user } from '../../Models/Auth';
import { $activeEventInfo } from '../../Models/EmergencyEvents';
import { setActiveEventGroupInfo } from '../../Models/EmergencyEvents/events';
import { openModal } from '../../Models/Modal/events';
import { $transparentEmergencyEventsInfo } from '../../Models/TransparentEmergencyEventsInfo';
import { fetchTransparentEmergencyEventsStatus } from '../../Models/TransparentEmergencyEventsInfo/effects';
import {
	setEventStatusTypeOptions,
	setKvitPersonsOptions,
	setSelectedEventStatusTypeOptions,
	setSelectedKvitPersonsOptions,
	setTableSortFilter,
} from '../../Models/TransparentEmergencyEventsInfo/events';
import { RegisteredModals } from '../../Shared/modalsConfig';
import { FilterOptions, SortOrder } from '../../Shared/types';
import {
	ContextMenuItem,
	ContextMenuPosition,
} from '../../UI/ContextMenu/types';
import MultiselectDropdownSearchAndSortRender from '../../UI/MultiselectDropdown/MultiselectDropdownSearchAndSortRender';
import { ITableBody, ITableColumn } from '../../UI/Table/types';
import {
	changeFilterOptions,
	getFinalTableBodyData,
	getSortOrder,
} from '../../Utils/tableUtils';

import { statusesLabels } from './const';

import styles from './TransparentEmergencyEventsTable.module.css';

export default function useEmergencyEventsTable() {
	const user = useStore($user);
	const {
		metricId,
		eventsInfo,
		eventStatusType,
		kvitPersons,
		selectedKvitPersons,
		selectedEventStatusType,
		sortFilter,
	} = useStore($transparentEmergencyEventsInfo);
	const isLoading = useStore(fetchTransparentEmergencyEventsStatus.pending);
	const [position, setPosition] = useState<ContextMenuPosition | null>(null);
	const { groupNumber } = useStore($activeEventInfo);

	const filteredEventsBySelectedFilters = eventsInfo.filter(
		({ kvitPerson, eventCodeType }) =>
			(kvitPersons.length > 0
				? selectedKvitPersons.includes(kvitPerson || '')
				: true) &&
			(eventStatusType.length > 0
				? selectedEventStatusType.includes(eventCodeType)
				: true),
	);

	const handleSortOptions = (accessor: string) => {
		if (sortFilter.accessor === accessor) {
			const order: SortOrder = getSortOrder(sortFilter.order);
			setTableSortFilter({ accessor, order });
		} else {
			setTableSortFilter({
				accessor,
				order: SortOrder.Asc,
			});
		}
	};

	const getSortStyles = (accessor: string) => {
		return {
			[styles.sort_icon_asc]:
				sortFilter.accessor === accessor && sortFilter.order === SortOrder.Asc,
			[styles.sort_icon_desc]:
				sortFilter.accessor === accessor && sortFilter.order === SortOrder.Desc,
			[styles.sort_icon]: true,
		};
	};

	const handleSelectKvitPersonFilterOption = (key: string) => {
		setKvitPersonsOptions(changeFilterOptions(key, kvitPersons));
	};
	const handleSelectEventStatusTypeFilterOption = (key: string) => {
		setEventStatusTypeOptions(changeFilterOptions(key, eventStatusType));
	};

	const handleContextMenuOpen = (evt: React.MouseEvent) => {
		evt.preventDefault();
		setPosition({ x: evt.pageX, y: evt.pageY });
	};

	const handleSelectAllEventStatusType = () => {
		const isAnyOptionChecked: boolean = eventStatusType.some(
			(item) => item.isChecked,
		);

		setEventStatusTypeOptions(
			eventStatusType.map((item: FilterOptions) => ({
				...item,
				isChecked: !isAnyOptionChecked,
			})),
		);
	};
	const handleSelectAllKvitPersons = () => {
		const isAnyOptionChecked: boolean = kvitPersons.some(
			(item) => item.isChecked,
		);

		setKvitPersonsOptions(
			kvitPersons.map((item: FilterOptions) => ({
				...item,
				isChecked: !isAnyOptionChecked,
			})),
		);
	};

	const handleApplyKvitPersonsOptions = () => {
		const selectedOptions = kvitPersons
			.filter((item) => item.isChecked)
			.map((item) => item.name);
		setSelectedKvitPersonsOptions(selectedOptions);
	};
	const handleApplyEventStatusTypeOptions = () => {
		const selectedOptions = eventStatusType
			.filter((item) => item.isChecked)
			.map((item) => Number(item.key));
		setSelectedEventStatusTypeOptions(selectedOptions);
	};

	const header: ITableColumn[] = [
		{
			accessor: 'name',
			text: 'Наименование',
			isSortable: false,
			sortOrder: 0,
			minWidth: 300,
			width: 300,
			renderHeaderCell: MultiselectDropdownSearchAndSortRender({
				title: 'Наименование',
				isSearchable: false,
				isSortable: true,
				onSortClick: handleSortOptions,
				accessor: 'name',
				sortClassName: clsx(getSortStyles('name')),
				hasFilterControl: false,
				className: styles.header_searchable,
				classNameFilterControl: styles.filter_control,
			}),
		},
		{
			accessor: 'min',
			text: 'Min',
			isSortable: false,
			sortOrder: 0,
			minWidth: 70,
			width: 70,
		},
		{
			accessor: 'max',
			text: 'Max',
			isSortable: false,
			sortOrder: 0,
			minWidth: 70,
			width: 70,
		},
		{
			accessor: 'setpoint',
			text: 'Уставка',
			isSortable: false,
			sortOrder: 0,
			renderHeaderCell: () => (
				<Tooltip tooltip={'Уставка по времени (мин)'}>
					<div className={styles.setpoint}>Уставка</div>
				</Tooltip>
			),
		},
		{
			accessor: 'lastEventStartDateTime',
			text: 'Нач. посл. события',
			isSortable: false,
			sortOrder: 0,
			minWidth: 100,
			width: 200,
			renderHeaderCell: MultiselectDropdownSearchAndSortRender({
				title: 'Нач. посл. события',
				isSearchable: false,
				isSortable: true,
				onSortClick: handleSortOptions,
				accessor: 'lastEventStartDateTime',
				sortClassName: clsx(getSortStyles('lastEventStartDateTime')),
				hasFilterControl: false,
				className: styles.header_searchable,
				classNameFilterControl: styles.filter_control,
			}),
		},
		{
			accessor: 'status',
			text: 'Статус',
			isSortable: false,
			sortOrder: 0,
			renderHeaderCell: MultiselectDropdownSearchAndSortRender({
				title: 'Статус',
				isSearchable: false,
				isSortable: false,
				accessor: 'status',
				hasFilterControl: true,
				className: styles.header_searchable,
				classNameFilterControl: styles.filter_control,
				items: eventStatusType,
				isSearchBoxVisible: false,
				onSelectAll: handleSelectAllEventStatusType,
				onApply: handleApplyEventStatusTypeOptions,
				onSelect: handleSelectEventStatusTypeFilterOption,
			}),
		},
		{
			accessor: 'event',
			text: 'Событие',
			isSortable: false,
			sortOrder: 0,
			minWidth: 100,
			width: 200,
		},
		{
			accessor: 'responsiblePersons',
			text: 'Ответственные',
			isSortable: false,
			sortOrder: 0,
			minWidth: 100,
			width: 200,
		},
		{
			accessor: 'kvitDateTime',
			text: 'Дата квитирования',
			isSortable: false,
			sortOrder: 0,
			minWidth: 100,
			width: 200,
		},
		{
			accessor: 'comment',
			text: '',
			isSortable: false,
			sortOrder: 0,
			minWidth: 30,
			width: 30,
			renderHeaderCell: () => (
				<div className={styles.header_comment}>
					<Comment className={styles.comment_icon} />
				</div>
			),
		},
		{
			accessor: 'kvitPerson',
			text: 'Квитировал',
			isSortable: false,
			sortOrder: 0,
			renderHeaderCell: MultiselectDropdownSearchAndSortRender({
				title: 'Квитировал',
				isSearchable: false,
				isSortable: false,
				accessor: 'kvitPerson',
				hasFilterControl: true,
				className: styles.header_searchable,
				classNameFilterControl: styles.filter_control,
				items: kvitPersons,
				isSearchBoxVisible: false,
				onSelectAll: handleSelectAllKvitPersons,
				onApply: handleApplyKvitPersonsOptions,
				onSelect: handleSelectKvitPersonFilterOption,
			}),
		},
	];

	const сontextMenuItems: ContextMenuItem[] = [
		{
			name: 'Открыть график',
			isDisabled: groupNumber == null,
			onClick: () => {
				openModal(RegisteredModals.EmergencyEventsGroupChart);
			},
			renderFn: () => (
				<span className={styles.context_menu_item}>
					<ChartIcon className={styles.context_menu_icon} />
					<span>Открыть график</span>
				</span>
			),
		},
	];

	// Формируем данные для тела таблицы
	const tableBody: ITableBody[] = filteredEventsBySelectedFilters.map(
		(item) => ({
			id: item.parameterCode,
			dataLine: [
				{
					accessor: 'name',
					text: item.parameterName,
					renderCell: () => (
						<span title={item.parameterName} className={styles.parameter_name}>
							{item.parameterName}
						</span>
					),
				},
				{
					accessor: 'min',
					text: item.min || '',
				},
				{
					accessor: 'max',
					text: item.max || '',
				},
				{
					accessor: 'setpoint',
					text: item.setpoint || '',
				},
				{
					accessor: 'lastEventStartDateTime',
					text: item.lastEventStartDateTime,
					renderCell: () => (
						<span>
							{format(
								new Date(item.lastEventStartDateTime),
								'dd.MM.yyyy, HH:mm',
							)}
						</span>
					),
				},
				{
					accessor: 'status',
					text: item.eventCodeType,
					renderCell: () => {
						const label = statusesLabels.get(item.eventCodeType)?.label;
						const color = statusesLabels.get(item.eventCodeType)?.color || '';
						return (
							<div className={styles.status} style={{ backgroundColor: color }}>
								{label}
							</div>
						);
					},
				},
				{
					accessor: 'event',
					text: item.event,
				},
				{
					accessor: 'responsiblePersons',
					text: item.responsiblePersons || '',
				},
				{
					accessor: 'kvitDateTime',
					text: item.kvitDateTime || '',
					renderCell: () => (
						<span>
							{item.kvitDateTime &&
								format(new Date(item.kvitDateTime), 'dd.MM.yyyy, HH:mm')}
						</span>
					),
				},
				{
					accessor: 'comment',
					text: item.comment || '',
					renderCell: () =>
						item.comment ? (
							<Tooltip tooltip={item.comment}>
								<div className={styles.comment}>
									<Comment
										className={clsx(
											styles.comment_icon,
											styles.comment_icon__active,
										)}
									/>
								</div>
							</Tooltip>
						) : (
							<div className={styles.comment}>
								{' '}
								<Comment className={clsx(styles.comment_icon)} />
							</div>
						),
				},
				{
					accessor: 'kvitPerson',
					text: item.kvitPerson || '',
				},
			],
			onContextMenu: (evt: React.MouseEvent) => {
				setActiveEventGroupInfo({
					groupNumber: item.groupId,
					maxSetpoint: item.max,
					minSetpoint: item.min,
					name: item.parameterName || '',
					unitName: item.unit || '',
					multipleCount: item.multipleCount || 0,
					gtype: item.gtype || 0,
				});
				handleContextMenuOpen(evt);
			},
		}),
	);

	useEffect(() => {
		if (!user) return;
		if (metricId) fetchTransparentEmergencyEventsStatus(metricId);
	}, [metricId, user]);

	const tableData = getFinalTableBodyData(tableBody, {}, sortFilter);

	return {
		tableData,
		header,
		isLoading,
		сontextMenuItems,
		position,
		setPosition,
	};
}
