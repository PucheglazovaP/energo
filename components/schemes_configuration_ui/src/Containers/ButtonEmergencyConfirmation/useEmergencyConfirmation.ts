import { useStore } from 'effector-react';

import useInterval from '../../Facades/useIntreval';
import { $roles, $user } from '../../Models/Auth';
import {
	$assignedEmergencyEventsNumber,
	$hasEmergencyConfirmRole,
} from '../../Models/EmergencyEvents';
import { fetchAssignedEmergencyEventsNumberFx } from '../../Models/EmergencyEvents/effects';
import { openModal } from '../../Models/Modal/events';
import { RegisteredModals } from '../../Shared/modalsConfig';
import { User } from '../../Shared/types';
const INTERVAL_VALUE: number = 60000;
function useEmergencyConfirmation() {
	const hasEmergencyConfirmRole: boolean = useStore($hasEmergencyConfirmRole);
	const emergencyEventsNumber: number = useStore(
		$assignedEmergencyEventsNumber,
	);
	const hasEmergencyEvents = emergencyEventsNumber > 0;
	const user: User | null = useStore($user);
	const roles = useStore($roles);

	function loadAssignedEmergencyEventsNumber() {
		if (user && roles.length) {
			fetchAssignedEmergencyEventsNumberFx({ userId: user.preferredUsername });
		}
	}

	function handleButtonClick() {
		openModal(RegisteredModals.AssignedEmergencyEvents);
	}

	useInterval(() => {
		loadAssignedEmergencyEventsNumber();
	}, INTERVAL_VALUE);

	return { hasEmergencyEvents, hasEmergencyConfirmRole, handleButtonClick };
}

export default useEmergencyConfirmation;
