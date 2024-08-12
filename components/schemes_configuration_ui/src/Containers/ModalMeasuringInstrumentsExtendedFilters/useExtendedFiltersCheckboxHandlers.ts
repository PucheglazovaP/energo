import { useMemo } from 'react';
import { useStore } from 'effector-react';

import {
	$nsiInstrumentTypesCheckedIds,
	$nsiMeasuringInstrumentTypes,
	$nsiMeasuringInstrumentUserStatuses,
	$nsiUserStatusesCheckedIds,
} from '../../Models/NSIMeasuringInstruments';
import {
	setInstrumentTypesCheckedIds,
	setUserStatusesCheckedIds,
} from '../../Models/NSIMeasuringInstruments/events';
import {
	NSIMeasuringInstrumentsType,
	NSIMeasuringInstrumentsUserStatus,
} from '../../Models/NSIMeasuringInstruments/types';
import { TreeItem } from '../../UI/Tree/types';
import { toggleArrayValue } from '../../Utils/toggleArrayValue';

function useExtendedFiltersCheckboxHandlers() {
	const instrumentsTypes: NSIMeasuringInstrumentsType[] = useStore(
		$nsiMeasuringInstrumentTypes,
	);
	const userStatuses: NSIMeasuringInstrumentsUserStatus[] = useStore(
		$nsiMeasuringInstrumentUserStatuses,
	);
	const instrumentTypesCheckedId: string[] = useStore(
		$nsiInstrumentTypesCheckedIds,
	);
	const userStatusesCheckedId: string[] = useStore($nsiUserStatusesCheckedIds);

	const instrumentTypesIds: string[] = useMemo(
		() =>
			instrumentsTypes.map(({ typeId }: NSIMeasuringInstrumentsType) => typeId),
		[instrumentsTypes],
	);

	const userStatusesIds: string[] = useMemo(
		() =>
			userStatuses.map(
				({ statusId }: NSIMeasuringInstrumentsUserStatus) => statusId,
			),
		[userStatuses],
	);

	const isUserStatusesCheckboxChecked: boolean = useMemo(
		() =>
			userStatusesIds.length > 0 &&
			userStatusesCheckedId.length === userStatusesIds.length,
		[userStatusesCheckedId, userStatusesIds],
	);

	const isUserStatusesCheckboxIndeterminate: boolean = useMemo(
		() =>
			userStatusesCheckedId.length > 0 &&
			userStatusesCheckedId.length < userStatusesIds.length,
		[userStatusesCheckedId, userStatusesIds],
	);

	const isInstrumentTypesCheckboxChecked: boolean = useMemo(
		() =>
			instrumentTypesIds.length > 0 &&
			instrumentTypesCheckedId.length === instrumentTypesIds.length,
		[instrumentTypesCheckedId, instrumentTypesIds],
	);

	const isInstrumentTypesCheckboxIndeterminate: boolean = useMemo(
		() =>
			instrumentTypesCheckedId.length > 0 &&
			instrumentTypesCheckedId.length < instrumentTypesIds.length,
		[instrumentTypesCheckedId, instrumentTypesIds],
	);

	const isCommonCheckboxChecked: boolean = useMemo(
		() => isUserStatusesCheckboxChecked && isInstrumentTypesCheckboxChecked,
		[isUserStatusesCheckboxChecked, isInstrumentTypesCheckboxChecked],
	);

	const isCommonCheckboxIndeterminate: boolean = useMemo(
		() =>
			isUserStatusesCheckboxIndeterminate ||
			isInstrumentTypesCheckboxIndeterminate ||
			((isUserStatusesCheckboxChecked || isInstrumentTypesCheckboxChecked) &&
				!isCommonCheckboxChecked),
		[
			isUserStatusesCheckboxIndeterminate,
			isInstrumentTypesCheckboxIndeterminate,
			isUserStatusesCheckboxChecked,
			isInstrumentTypesCheckboxChecked,
			isCommonCheckboxChecked,
		],
	);

	function handleCommonCheckboxChange() {
		if (isCommonCheckboxIndeterminate || !isCommonCheckboxChecked) {
			setInstrumentTypesCheckedIds(instrumentTypesIds);
			setUserStatusesCheckedIds(userStatusesIds);
		} else {
			setInstrumentTypesCheckedIds([]);
			setUserStatusesCheckedIds([]);
		}
	}

	function handleInstrumentTypesCheckboxChange() {
		if (
			isInstrumentTypesCheckboxIndeterminate ||
			!isInstrumentTypesCheckboxChecked
		) {
			setInstrumentTypesCheckedIds(instrumentTypesIds);
		} else {
			setInstrumentTypesCheckedIds([]);
		}
	}

	function handleUserStatusesCheckboxChange() {
		if (isUserStatusesCheckboxIndeterminate || !isUserStatusesCheckboxChecked) {
			setUserStatusesCheckedIds(userStatusesIds);
		} else {
			setUserStatusesCheckedIds([]);
		}
	}

	function handleInstrumentTypeCheckboxChange(typeId: string) {
		const newCheckedIds: string[] = toggleArrayValue(
			instrumentTypesCheckedId.slice(),
			typeId,
		);
		setInstrumentTypesCheckedIds(newCheckedIds);
	}

	function handleUserStatusCheckboxChange(statusId: string) {
		const newCheckedIds: string[] = toggleArrayValue(
			userStatusesCheckedId.slice(),
			statusId,
		);
		setUserStatusesCheckedIds(newCheckedIds);
	}

	function handleNodeClick(node: TreeItem) {
		const { type, name } = node;
		if (type === 'name') {
			handleCommonCheckboxChange();
		}

		if (type === 'types') {
			handleInstrumentTypesCheckboxChange();
		}

		if (type === 'statuses') {
			handleUserStatusesCheckboxChange();
		}

		if (type === 'type') {
			handleInstrumentTypeCheckboxChange(name);
		}

		if (type === 'status') {
			handleUserStatusCheckboxChange(name);
		}
	}

	return {
		isUserStatusesCheckboxChecked,
		isUserStatusesCheckboxIndeterminate,
		isInstrumentTypesCheckboxChecked,
		isInstrumentTypesCheckboxIndeterminate,
		isCommonCheckboxChecked,
		isCommonCheckboxIndeterminate,
		handleCommonCheckboxChange,
		handleInstrumentTypesCheckboxChange,
		handleUserStatusesCheckboxChange,
		handleInstrumentTypeCheckboxChange,
		handleUserStatusCheckboxChange,
		handleNodeClick,
	};
}

export default useExtendedFiltersCheckboxHandlers;
