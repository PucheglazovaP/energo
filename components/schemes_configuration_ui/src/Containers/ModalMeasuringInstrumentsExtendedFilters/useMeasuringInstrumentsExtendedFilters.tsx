import { useEffect, useMemo, useState } from 'react';
import { Checkbox } from '@evraz/ui-kit';
import clsx from 'clsx';
import { useStore } from 'effector-react';

import { $user } from '../../Models/Auth';
import { closeModal } from '../../Models/Modal/events';
import {
	$nsiInstrumentTypesCheckedIds,
	$nsiMeasuringInstrumentsSearchValues,
	$nsiMeasuringInstrumentTypes,
	$nsiMeasuringInstrumentUserStatuses,
	$nsiUserStatusesCheckedIds,
} from '../../Models/NSIMeasuringInstruments';
import {
	getMeasuringInstrumentsListFx,
	getMeasuringInstrumentTypesFx,
	getMeasuringInstrumentUserStatusesFx,
} from '../../Models/NSIMeasuringInstruments/effects';
import { setNsiMeasuringInstrumentsFilters } from '../../Models/NSIMeasuringInstruments/events';
import {
	NSIMeasuringInstrumentsSearchValuesModel,
	NSIMeasuringInstrumentsType,
	NSIMeasuringInstrumentsUserStatus,
} from '../../Models/NSIMeasuringInstruments/types';
import { RegisteredModals } from '../../Shared/modalsConfig';
import { User } from '../../Shared/types';
import { ModuleName } from '../../Shared/Types/moduleName';
import { TreeItem } from '../../UI/Tree/types';

import useExtendedFiltersCheckboxHandlers from './useExtendedFiltersCheckboxHandlers';

import styles from './ModalMeasuringInstrumentsExtendedFilters.module.css';

function useMeasuringInstrumentsExtendedFilters() {
	const [isInstrumentTypesTreeOpen, setIsInstrumentTypesTreeOpen] =
		useState<boolean>(true);
	const [isUserStatusesTreeOpen, setIsUserStatusesTreeOpen] =
		useState<boolean>(true);

	const user: User | null = useStore($user);
	const {
		equipmentShortName,
		manufacturerTypeName,
		location,
		factoryNumber,
	}: NSIMeasuringInstrumentsSearchValuesModel = useStore(
		$nsiMeasuringInstrumentsSearchValues,
	);
	const instrumentsTypes: NSIMeasuringInstrumentsType[] = useStore(
		$nsiMeasuringInstrumentTypes,
	);
	const userStatuses: NSIMeasuringInstrumentsUserStatus[] = useStore(
		$nsiMeasuringInstrumentUserStatuses,
	);
	const areInstrumentTypesLoading = useStore(
		getMeasuringInstrumentTypesFx.pending,
	);
	const areUserStatusesLoading = useStore(
		getMeasuringInstrumentUserStatusesFx.pending,
	);
	const instrumentTypesCheckedId: string[] = useStore(
		$nsiInstrumentTypesCheckedIds,
	);
	const userStatusesCheckedId: string[] = useStore($nsiUserStatusesCheckedIds);

	const {
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
	} = useExtendedFiltersCheckboxHandlers();

	function handleNodeExpand(node: TreeItem) {
		const { type } = node;

		if (type === 'types') {
			setIsInstrumentTypesTreeOpen(!isInstrumentTypesTreeOpen);
		}

		if (type === 'statuses') {
			setIsUserStatusesTreeOpen(!isUserStatusesTreeOpen);
		}
	}

	function handleClose() {
		closeModal(RegisteredModals.MeasuringInstrumentsExtendedFilters);
	}
	function handleConfirm() {
		const userStatusCode: string | null =
			userStatusesCheckedId.join(',') || null;
		const instrumentTypesCode: string | null =
			instrumentTypesCheckedId.join(',') || null;

		setNsiMeasuringInstrumentsFilters({
			userStatus: userStatusCode,
			measurementType: instrumentTypesCode,
		});

		if (user) {
			getMeasuringInstrumentsListFx({
				action: 'set',
				measurementTypeCode: instrumentTypesCode,
				equipmentShortName,
				manufacturerTypeName,
				productionYear: null,
				userStatusCode: userStatusCode,
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
					ModuleName.UseMeasuringInstrumentsExtendedFilters_getMeasuringInstrumentsListFx,
			});
		}

		handleClose();
	}

	const treeData: TreeItem[] = useMemo(() => {
		const data: TreeItem[] = [
			{
				id: 0,
				name: 'Наименование',
				displayName: 'Наименование',
				isOpen: true,
				type: 'name',
				renderFn: () => (
					<div className={styles.tree_item}>
						<Checkbox
							className={clsx(styles.checkbox, {
								[styles.indeterminate]: isCommonCheckboxIndeterminate,
								[styles.checked]: isCommonCheckboxChecked,
							})}
							isChecked={isCommonCheckboxChecked}
							isIndeterminate={isCommonCheckboxIndeterminate}
							onChange={handleCommonCheckboxChange}
						/>
						<div className={styles.tree_label}>Наименование</div>
					</div>
				),
			},
			{
				id: -1,
				name: 'Вид измерений',
				displayName: 'Вид измерений',
				parentId: 0,
				isOpen: isInstrumentTypesTreeOpen,
				parentType: 'name',
				type: 'types',
				renderFn: () => (
					<div className={styles.tree_item}>
						<Checkbox
							className={clsx(styles.checkbox, {
								[styles.indeterminate]: isInstrumentTypesCheckboxIndeterminate,
								[styles.checked]: isInstrumentTypesCheckboxChecked,
							})}
							isChecked={isInstrumentTypesCheckboxChecked}
							isIndeterminate={isInstrumentTypesCheckboxIndeterminate}
							onChange={handleInstrumentTypesCheckboxChange}
						/>
						<div className={styles.tree_label}>Вид измерений</div>
					</div>
				),
			},
			{
				id: -2,
				name: 'Статус',
				displayName: 'Статус',
				parentId: 0,
				isOpen: isUserStatusesTreeOpen,
				parentType: 'name',
				type: 'statuses',
				renderFn: () => (
					<div className={styles.tree_item}>
						<Checkbox
							className={clsx(styles.checkbox, {
								[styles.indeterminate]: isUserStatusesCheckboxIndeterminate,
								[styles.checked]: isUserStatusesCheckboxChecked,
							})}
							isChecked={isUserStatusesCheckboxChecked}
							isIndeterminate={isUserStatusesCheckboxIndeterminate}
							onChange={handleUserStatusesCheckboxChange}
						/>
						<div className={styles.tree_label}>Статус</div>
					</div>
				),
			},
		];
		const instrumentsTypesItems: TreeItem[] = instrumentsTypes.map(
			({ typeId, typeName }: NSIMeasuringInstrumentsType) => {
				const isChecked: boolean = instrumentTypesCheckedId.includes(typeId);
				function handleChange() {
					handleInstrumentTypeCheckboxChange(typeId);
				}
				return {
					id: Number(typeId),
					name: typeId,
					displayName: typeName,
					type: 'type',
					parentId: -1,
					parentType: 'types',
					isLast: true,
					renderFn: () => (
						<div className={styles.tree_item}>
							<Checkbox
								className={clsx(styles.checkbox, {
									[styles.checked]: isChecked,
								})}
								isChecked={isChecked}
								onChange={handleChange}
							/>
							<div className={styles.tree_label}>{typeName}</div>
						</div>
					),
				};
			},
		);
		const userStatusesItems: TreeItem[] = userStatuses.map(
			({
				statusId,
				statusSequenceNumber,
				statusName,
			}: NSIMeasuringInstrumentsUserStatus) => {
				const isChecked: boolean = userStatusesCheckedId.includes(statusId);
				function handleChange() {
					handleUserStatusCheckboxChange(statusId);
				}
				return {
					id: statusSequenceNumber,
					name: statusId,
					displayName: statusName,
					type: 'status',
					parentId: -2,
					parentType: 'statuses',
					isLast: true,
					renderFn: () => (
						<div className={styles.tree_item}>
							<Checkbox
								className={clsx(styles.checkbox, {
									[styles.checked]: isChecked,
								})}
								isChecked={isChecked}
								onChange={handleChange}
							/>
							<div className={styles.tree_label}>{statusName}</div>
						</div>
					),
				};
			},
		);

		return [...data, ...instrumentsTypesItems, ...userStatusesItems];
	}, [
		instrumentsTypes,
		userStatuses,
		instrumentTypesCheckedId,
		userStatusesCheckedId,
		isCommonCheckboxChecked,
		isCommonCheckboxIndeterminate,
		isUserStatusesCheckboxChecked,
		isUserStatusesCheckboxIndeterminate,
		isInstrumentTypesCheckboxChecked,
		isInstrumentTypesCheckboxIndeterminate,
		isInstrumentTypesTreeOpen,
		isUserStatusesTreeOpen,
	]);

	const isTreeLoading = areInstrumentTypesLoading || areUserStatusesLoading;

	useEffect(() => {
		if (user) {
			getMeasuringInstrumentTypesFx({
				userId: user.preferredUsername,
				moduleName:
					ModuleName.UseMeasuringInstrumentsExtendedFilters_getMeasuringInstrumentTypesFx,
			});
			getMeasuringInstrumentUserStatusesFx({
				userId: user.preferredUsername,
				moduleName:
					ModuleName.UseMeasuringInstrumentsExtendedFilters_getMeasuringInstrumentUserStatusesFx,
			});
		}
	}, [user]);

	return {
		treeData,
		isTreeLoading,
		handleNodeExpand,
		handleNodeClick,
		handleConfirm,
		handleClose,
	};
}

export default useMeasuringInstrumentsExtendedFilters;
