import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { Button } from '@evraz/ui-kit';
import { useStore } from 'effector-react';

import { Close } from '../../Icons';
import { $user } from '../../Models/Auth';
import {
	$assignedEmergencyEvents,
	$assignedEventsCheckedIds,
	$filterAcknowledgmentStatus,
	$filterDates,
} from '../../Models/EmergencyEvents';
import {
	acknowledgeAssignedEmergencyEventsFx,
	fetchAssignedEmergencyEventsFx,
} from '../../Models/EmergencyEvents/effects';
import { setAssignedEventsCheckedIds } from '../../Models/EmergencyEvents/events';
import { closeModal } from '../../Models/Modal/events';
import { RegisteredModals } from '../../Shared/modalsConfig';
import {
	AcknowledgementStatusFilter,
	AssignedEmergencyEvent,
	User,
} from '../../Shared/types';
import { ModuleName } from '../../Shared/Types/moduleName';
import { ITableBody, ITableColumn } from '../../UI/Table/types';
import { DateFormat, formatDate } from '../../Utils/dateUtils';
import { toggleArrayValue } from '../../Utils/toggleArrayValue';

import styles from './ModalAcknowledgeEmergencyEvents.module.css';

function useAcknowledgeEmergencyEvents() {
	const user: User | null = useStore($user);
	const checkedIds: number[] = useStore($assignedEventsCheckedIds);
	const dates: [Date, Date] = useStore($filterDates);
	const acknowledgementStatus: AcknowledgementStatusFilter = useStore(
		$filterAcknowledgmentStatus,
	);

	const assignedEvents: AssignedEmergencyEvent[] = useStore(
		$assignedEmergencyEvents,
	);
	const checkedEvents: AssignedEmergencyEvent[] = useMemo(
		() =>
			assignedEvents.filter((assignedEvent: AssignedEmergencyEvent) =>
				checkedIds.includes(assignedEvent.id),
			),
		[checkedIds, assignedEvents],
	);
	const [comment, setComment] = useState<string>('');

	const userName: string = user ? `${user.lastName} ${user.firstName}` : '';

	function handleCommentChange(evt: ChangeEvent<HTMLTextAreaElement>) {
		const { value } = evt.target;
		setComment(value);
	}
	const handleEventDelete = (id: number) => () => {
		const newCheckedIds = toggleArrayValue(checkedIds.slice(), id);
		setAssignedEventsCheckedIds(newCheckedIds);
	};
	async function handleConfirm() {
		if (user) {
			checkedIds.forEach(async (nodeId: number) => {
				await acknowledgeAssignedEmergencyEventsFx({
					nodeId,
					comment,
					userId: user.preferredUsername,
					moduleName:
						ModuleName.UseAcknowledgeEmergencyEvents_acknowledgeAssignedEmergencyEventsFx,
				});
			});
			await fetchAssignedEmergencyEventsFx({
				userId: user.preferredUsername,
				dateFrom: formatDate(dates[0], DateFormat.DisplayDatabaseFormat),
				dateTo: formatDate(dates[1], DateFormat.DisplayDatabaseFormat),
				acknowledgementStatus,
				moduleName:
					ModuleName.UseAcknowledgeEmergencyEvents_fetchAssignedEmergencyEventsFx,
			});
			handleCancel();
		}
	}
	function handleCancel() {
		closeModal(RegisteredModals.AcknowledgeAssignedEmergencyEvents);
	}

	const header: ITableColumn[] = [
		{
			accessor: 'paramName',
			text: 'Наименование',
			sortOrder: 0,
		},
		{
			accessor: 'lastEventStartDate',
			text: 'Нач. посл. события',
			sortOrder: 0,
		},
		{
			accessor: 'eventName',
			text: 'Событие',
			sortOrder: 0,
		},
		{
			accessor: 'removeEvent',
			text: ' ',
			sortOrder: 0,
		},
	];
	const data: ITableBody[] = checkedEvents.map(
		(event: AssignedEmergencyEvent) => ({
			dataLine: [
				{
					accessor: 'paramName',
					text: event.paramName,
				},
				{
					accessor: 'lastEventStartDate',
					text: event.lastEventStartDateString,
				},
				{
					accessor: 'eventName',
					text: event.eventName,
				},
				{
					accessor: 'removeEvent',
					text: '',
					renderCell: () => (
						<Button
							className={styles.remove_event_button}
							onClick={handleEventDelete(event.id)}
						>
							<Close className={styles.remove_event_button_icon} />
						</Button>
					),
				},
			],
		}),
	);

	useEffect(() => {
		if (checkedIds.length === 0) {
			handleCancel();
		}
	}, [checkedIds.length]);

	return {
		header,
		data,
		comment,
		handleCommentChange,
		handleConfirm,
		handleCancel,
		userName,
	};
}

export default useAcknowledgeEmergencyEvents;
