import { useEffect } from 'react';
import { useStore } from 'effector-react';

import { $user } from '../../Models/Auth';
import {
	$assignedEventsCheckedIds,
	$filterAcknowledgmentStatus,
	$filterDates,
} from '../../Models/EmergencyEvents';
import { fetchAssignedEmergencyEventsFx } from '../../Models/EmergencyEvents/effects';
import {
	setAcknowledgementStatus,
	setFilterDates,
} from '../../Models/EmergencyEvents/events';
import { openModal } from '../../Models/Modal/events';
import { RegisteredModals } from '../../Shared/modalsConfig';
import { AcknowledgementStatusFilter, User } from '../../Shared/types';
import { ModuleName } from '../../Shared/Types/moduleName';
import { DateFormat, formatDate } from '../../Utils/dateUtils';

function useAssignedEmergencyEvents() {
	const user: User | null = useStore($user);
	const dates: [Date, Date] = useStore($filterDates);
	const acknowledgementStatus: AcknowledgementStatusFilter = useStore(
		$filterAcknowledgmentStatus,
	);
	const checkedIds: number[] = useStore($assignedEventsCheckedIds);
	const isAcknowledgeButtonDisabled = checkedIds.length === 0;

	function handleDatesChange(period: Date[]) {
		setFilterDates([period[0], period[1]]);
	}
	function handleAcknowledgementStatusChange(id: string) {
		setAcknowledgementStatus(id as AcknowledgementStatusFilter);
	}
	function handleAcknowledgementButtonClick() {
		openModal(RegisteredModals.AcknowledgeAssignedEmergencyEvents);
	}

	useEffect(() => {
		if (user) {
			fetchAssignedEmergencyEventsFx({
				userId: user.preferredUsername,
				dateFrom: formatDate(dates[0], DateFormat.DisplayDatabaseFormat),
				dateTo: formatDate(dates[1], DateFormat.DisplayDatabaseFormat),
				acknowledgementStatus,
				moduleName:
					ModuleName.UseAssignedEmergencyEvents_fetchAssignedEmergencyEventsFx,
			});
		}
	}, [user, dates, acknowledgementStatus]);

	return {
		dates,
		handleDatesChange,
		acknowledgementStatus,
		isAcknowledgeButtonDisabled,
		handleAcknowledgementStatusChange,
		handleAcknowledgementButtonClick,
	};
}

export default useAssignedEmergencyEvents;
