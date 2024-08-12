import { useMemo } from 'react';
import { useStore } from 'effector-react';

import { $user } from '../../Models/Auth';
import {
	$nsiMeasuringInstrumentsFilters,
	$nsiMeasuringInstrumentsSearchValues,
	$nsiMeasuringInstrumentTypes,
	$nsiMeasuringInstrumentUserStatuses,
} from '../../Models/NSIMeasuringInstruments';
import { getMeasuringInstrumentsListFx } from '../../Models/NSIMeasuringInstruments/effects';
import {
	setInstrumentTypesCheckedIds,
	setNsiMeasuringInstrumentsFilters,
	setUserStatusesCheckedIds,
} from '../../Models/NSIMeasuringInstruments/events';
import {
	NSIMeasuringInstrumentsFiltersModel,
	NSIMeasuringInstrumentsSearchValuesModel,
	NSIMeasuringInstrumentsType,
	NSIMeasuringInstrumentsUserStatus,
} from '../../Models/NSIMeasuringInstruments/types';
import { User } from '../../Shared/types';
import { ModuleName } from '../../Shared/Types/moduleName';

function useExtendedFiltersChips() {
	const user: User | null = useStore($user);
	const {
		equipmentShortName,
		manufacturerTypeName,
		location,
		factoryNumber,
	}: NSIMeasuringInstrumentsSearchValuesModel = useStore(
		$nsiMeasuringInstrumentsSearchValues,
	);
	const { measurementType, userStatus }: NSIMeasuringInstrumentsFiltersModel =
		useStore($nsiMeasuringInstrumentsFilters);
	const instrumentsTypes: NSIMeasuringInstrumentsType[] = useStore(
		$nsiMeasuringInstrumentTypes,
	);
	const userStatuses: NSIMeasuringInstrumentsUserStatus[] = useStore(
		$nsiMeasuringInstrumentUserStatuses,
	);

	const instrumentTypesCheckedId: string[] = useMemo(
		() => measurementType?.split(',') || [],
		[measurementType],
	);

	const userStatusesCheckedId: string[] = useMemo(
		() => userStatus?.split(',') || [],
		[userStatus],
	);

	const instrumentTypeChipLabel: string = useMemo(() => {
		if (instrumentTypesCheckedId.length === 0) {
			return '';
		}

		if (instrumentTypesCheckedId.length === 1) {
			const instrumentType: string =
				instrumentsTypes.find(
					({ typeId }) => typeId === instrumentTypesCheckedId[0],
				)?.typeName || '';

			return instrumentType;
		}

		return `${instrumentTypesCheckedId.length} зн.`;
	}, [instrumentsTypes, instrumentTypesCheckedId]);

	const userStatusChipLabel: string = useMemo(() => {
		if (userStatusesCheckedId.length === 0) {
			return '';
		}

		if (userStatusesCheckedId.length === 1) {
			const userStatus: string =
				userStatuses.find(
					({ statusId }) => statusId === userStatusesCheckedId[0],
				)?.statusName || '';

			return userStatus;
		}

		return `${userStatusesCheckedId.length} зн.`;
	}, [userStatuses, userStatusesCheckedId]);

	const isUserStatusesChipShown: boolean = userStatusesCheckedId.length > 0;
	const isInstrumentTypesChipShown: boolean =
		instrumentTypesCheckedId.length > 0;
	const isCommonChipShown: boolean =
		isInstrumentTypesChipShown && isUserStatusesChipShown;

	function getData(measurementType: string | null, userStatus: string | null) {
		if (user) {
			getMeasuringInstrumentsListFx({
				action: 'set',
				measurementTypeCode: measurementType,
				equipmentShortName,
				manufacturerTypeName,
				productionYear: null,
				userStatusCode: userStatus,
				equipmentNumber: null,
				location,
				factoryNumber,
				pageRowCount: 20,
				pageNumber: 1,
				firstRow: 0,
				selectRow: null,
				pageTotalCount: 0,
				userId: user.preferredUsername,
				moduleName:
					ModuleName.UseExtendedFiltersChips_getMeasuringInstrumentsListFx,
			});
		}
	}

	function handleInstrumentTypesFilterClear() {
		setInstrumentTypesCheckedIds([]);
		setNsiMeasuringInstrumentsFilters({ measurementType: null, userStatus });
		getData(null, userStatus);
	}
	function handleUserStatusesFilterClear() {
		setUserStatusesCheckedIds([]);
		setNsiMeasuringInstrumentsFilters({ measurementType, userStatus: null });
		getData(measurementType, null);
	}
	function handleExtendedFilterClear() {
		setInstrumentTypesCheckedIds([]);
		setUserStatusesCheckedIds([]);
		setNsiMeasuringInstrumentsFilters({
			measurementType: null,
			userStatus: null,
		});

		getData(null, null);
	}

	return {
		isUserStatusesChipShown,
		isInstrumentTypesChipShown,
		instrumentTypeChipLabel,
		userStatusChipLabel,
		isCommonChipShown,
		handleInstrumentTypesFilterClear,
		handleUserStatusesFilterClear,
		handleExtendedFilterClear,
	};
}

export default useExtendedFiltersChips;
