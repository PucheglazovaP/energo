import { MouseEvent, useMemo, useState } from 'react';
import { Checkbox, Tooltip, TrendingActivity } from '@evraz/ui-kit';
import clsx from 'clsx';
import { useStore } from 'effector-react';

import { Comment } from '../../Icons';
import {
	$activeEventId,
	$activeEventInfo,
	$assignedEmergencyEvents,
	$assignedEmergencyEventsSort,
	$assignedEventsCheckedIds,
} from '../../Models/EmergencyEvents';
import { fetchAssignedEmergencyEventsFx } from '../../Models/EmergencyEvents/effects';
import {
	setActiveEventGroupInfo,
	setActiveEventGroupNumber,
	setActiveEventId,
	setAssignedEmergencyEventsSort,
	setAssignedEventsCheckedIds,
} from '../../Models/EmergencyEvents/events';
import { openModal } from '../../Models/Modal/events';
import { RegisteredModals } from '../../Shared/modalsConfig';
import {
	AcknowledgementStatus,
	AssignedEmergencyEvent,
	SortOptions,
	SortOrder,
} from '../../Shared/types';
import {
	ContextMenuItem,
	ContextMenuPosition,
} from '../../UI/ContextMenu/types';
import MultiselectDropdownSearchAndSortRender from '../../UI/MultiselectDropdown/MultiselectDropdownSearchAndSortRender';
import { ITableBody, ITableColumn } from '../../UI/Table/types';
import { getSortOrder, sortByOrder } from '../../Utils/tableUtils';
import { toggleArrayValue } from '../../Utils/toggleArrayValue';

import { acknowledgementStatusesLabels } from './constants';

import styles from './TableAssignedEmergencyEvents.module.css';
function useTableAssignedEmergencyEvents() {
	const assignedEmergencyEvents: AssignedEmergencyEvent[] = useStore(
		$assignedEmergencyEvents,
	);
	const sortFilter: SortOptions = useStore($assignedEmergencyEventsSort);
	const checkedIds: number[] = useStore($assignedEventsCheckedIds);
	const activeEventId: number = useStore($activeEventId);
	const isLoading: boolean = useStore(fetchAssignedEmergencyEventsFx.pending);
	const [position, setPosition] = useState<ContextMenuPosition | null>(null);
	const { groupNumber } = useStore($activeEventInfo);

	const allEventIds: number[] = useMemo(
		() =>
			assignedEmergencyEvents
				.filter(
					(event: AssignedEmergencyEvent) =>
						event.status === AcknowledgementStatus.New,
				)
				.map((filteredEvent: AssignedEmergencyEvent) => filteredEvent.id),
		[assignedEmergencyEvents],
	);

	const handleSortOptions = (accessor: string) => {
		if (sortFilter.accessor === accessor) {
			const order: SortOrder = getSortOrder(sortFilter.order);
			setAssignedEmergencyEventsSort({ accessor, order });
		} else {
			setAssignedEmergencyEventsSort({
				accessor: accessor,
				order: SortOrder.Asc,
			});
		}
	};

	const handleCheckboxCheck = (id: number) => () => {
		const newCheckedIds: number[] = toggleArrayValue(checkedIds.slice(), id);
		setAssignedEventsCheckedIds(newCheckedIds);
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

	const handleHeaderCheckboxChange = () => {
		if (allEventIds.length === checkedIds.length && checkedIds.length > 0) {
			setAssignedEventsCheckedIds([]);
			return;
		}
		setAssignedEventsCheckedIds(allEventIds);
		return;
	};
	const handleOpenChart = () => {
		openModal(RegisteredModals.EmergencyEventsGroupChart);
	};

	const activePosition: number | undefined = useMemo(() => {
		const activePosition: number = assignedEmergencyEvents.findIndex(
			(position) => position.id === activeEventId,
		);
		if (activePosition === -1) {
			return;
		}
		return activePosition;
	}, [assignedEmergencyEvents, activeEventId]);

	const contextMenuItems: ContextMenuItem[] = [
		{
			name: 'Открыть график',
			onClick: handleOpenChart,
			isDisabled: groupNumber == null,
			renderFn: () => (
				<div className={'context_menu_item'}>
					<TrendingActivity className={'context_menu_icon'} />
					<span>Открыть график</span>
				</div>
			),
		},
	];

	const header: ITableColumn[] = [
		{
			accessor: 'checkbox',
			text: ' ',
			sortOrder: 0,
			renderHeaderCell: () => {
				const isIndeterminate =
					checkedIds.length > 0 && checkedIds.length < allEventIds.length;
				const isChecked =
					allEventIds.length === checkedIds.length && checkedIds.length !== 0;
				return (
					<Checkbox
						isIndeterminate={isIndeterminate}
						isChecked={isChecked}
						onChange={handleHeaderCheckboxChange}
						className={clsx(styles.checkbox, {
							[styles.indeterminate]: isIndeterminate,
							[styles.checked]: isChecked,
						})}
					/>
				);
			},
		},
		{
			accessor: 'paramName',
			text: 'Наименование',
			sortOrder: 0,
			isSortable: false,
			renderHeaderCell: MultiselectDropdownSearchAndSortRender({
				isSearchable: false,
				isSortable: true,
				onSortClick: handleSortOptions,
				sortClassName: clsx(getSortStyles('paramName')),
				accessor: 'paramName',
				title: 'Наименование',
				className: styles.header_searchable,
			}),
		},
		{
			accessor: 'min',
			text: 'Min',
			sortOrder: 0,
		},
		{
			accessor: 'max',
			text: 'Max',
			sortOrder: 0,
		},
		{
			accessor: 'setPoint',
			text: 'Уставка',
			sortOrder: 0,
			renderHeaderCell: () => (
				<Tooltip tooltip={'Уставка по времени (мин)'}>
					<div className={styles.setpoint}>Уставка</div>
				</Tooltip>
			),
		},
		{
			accessor: 'lastEventStartDate',
			text: 'Нач. посл. события',
			sortOrder: 0,
			isSortable: false,
			renderHeaderCell: MultiselectDropdownSearchAndSortRender({
				isSearchable: false,
				isSortable: true,
				onSortClick: handleSortOptions,
				sortClassName: clsx(getSortStyles('lastEventStartDate')),
				accessor: 'lastEventStartDate',
				title: 'Нач. посл. события',
				className: styles.header_searchable,
			}),
		},
		{
			accessor: 'status',
			text: 'Статус',
			sortOrder: 0,
		},
		{
			accessor: 'eventName',
			text: 'Событие',
			sortOrder: 0,
		},
		{
			accessor: 'responsibles',
			text: 'Ответственные',
			sortOrder: 0,
		},
		{
			accessor: 'acknowledgementDate',
			text: 'Дата квитирования',
			sortOrder: 0,
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
			accessor: 'acknowledgementAuthor',
			text: 'Квитировал',
			sortOrder: 0,
		},
	];

	const data: ITableBody[] = assignedEmergencyEvents.map(
		(emergencyEvent: AssignedEmergencyEvent) => ({
			dataLine: [
				{
					accessor: 'checkbox',
					text: '',
					renderCell: () => {
						const isDisabled: boolean =
							emergencyEvent.status === AcknowledgementStatus.Acknowledged;
						const isChecked =
							checkedIds.includes(emergencyEvent.id) || isDisabled;

						return (
							<Checkbox
								isChecked={isChecked}
								isDisabled={isDisabled}
								onChange={handleCheckboxCheck(emergencyEvent.id)}
								className={clsx(styles.checkbox, {
									[styles.checked]: isChecked,
								})}
							/>
						);
					},
				},
				{
					accessor: 'paramName',
					text: emergencyEvent.paramName,
				},
				{
					accessor: 'min',
					text:
						emergencyEvent.valueMin == null
							? '-'
							: String(emergencyEvent.valueMin),
				},
				{
					accessor: 'max',
					text:
						emergencyEvent.valueMax == null
							? '-'
							: String(emergencyEvent.valueMax),
				},
				{
					accessor: 'setPoint',
					text: emergencyEvent.setPoint,
				},
				{
					accessor: 'lastEventStartDate',
					text: emergencyEvent.lastEventStartDateString,
				},
				{
					accessor: 'status',
					text: '',
					renderCell: () => (
						<div className={clsx(styles.status, styles[emergencyEvent.status])}>
							{acknowledgementStatusesLabels.get(emergencyEvent.status)}
						</div>
					),
				},
				{
					accessor: 'eventName',
					text: emergencyEvent.eventName,
				},
				{
					accessor: 'responsibles',
					text: emergencyEvent.responsibles,
				},
				{
					accessor: 'acknowledgementDate',
					text: emergencyEvent.acknowledgementDate,
				},
				{
					accessor: 'comment',
					text: '',
					renderCell: () =>
						emergencyEvent.comment ? (
							<Tooltip tooltip={emergencyEvent.comment}>
								<div>
									<Comment
										className={clsx(
											styles.comment_icon,
											styles.comment_icon__active,
										)}
									/>
								</div>
							</Tooltip>
						) : (
							<Comment className={clsx(styles.comment_icon)} />
						),
				},
				{
					accessor: 'acknowledgementAuthor',
					text: emergencyEvent.acknowledgementAuthor,
				},
			],
			onRowClick: () => {
				setActiveEventId(emergencyEvent.id);
				setActiveEventGroupNumber(emergencyEvent.groupNumber || 0);
			},
			onContextMenu: (evt: MouseEvent) => {
				evt.preventDefault();
				setPosition({
					x: evt.pageX,
					y: evt.pageY,
				});
				setActiveEventId(emergencyEvent.id);
				setActiveEventGroupInfo({
					groupNumber: emergencyEvent.groupNumber,
					maxSetpoint: emergencyEvent.valueMax,
					minSetpoint: emergencyEvent.valueMin,
					name: emergencyEvent.paramName,
					unitName: emergencyEvent.unit,
				});
			},
		}),
	);

	const sortedEvents: ITableBody[] = useMemo(() => {
		return sortFilter.order === SortOrder.None
			? data
			: sortByOrder(data, sortFilter.accessor, sortFilter.order);
	}, [data, sortFilter]);

	return {
		header,
		data: sortedEvents,
		isLoading,
		activePosition,
		contextMenuItems,
		position,
		setPosition,
	};
}

export default useTableAssignedEmergencyEvents;
