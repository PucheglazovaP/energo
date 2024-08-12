import { useCallback, useEffect, useMemo, useState } from 'react';
import { Checkbox } from '@evraz/ui-kit';
import clsx from 'clsx';
import { useStore } from 'effector-react';

import { $user } from '../../Models/Auth';
import { closeModal } from '../../Models/Modal/events';
import {
	$nsiCurrentAvailableFilters,
	$nsiCurrentObjectType,
	$nsiExtendedFiltersCheckedIds,
} from '../../Models/NSITreeDevices';
import { getAvailableFiltersNSIFx } from '../../Models/NSITreeDevices/effects';
import { setNSIExtendedFiltersCheckedIdsConfirmed } from '../../Models/NSITreeDevices/events';
import { RegisteredModals } from '../../Shared/modalsConfig';
import { User } from '../../Shared/types';
import { ModuleName } from '../../Shared/Types/moduleName';
import { TreeItem } from '../../UI/Tree/types';
import { toggleArrayValue } from '../../Utils/toggleArrayValue';

import useCheckboxHandlers from './useCheckboxHandlers';
import { getParameterLabel } from './utils';

import styles from './ModalNSITreeExtendedFilters.module.css';
function useExtendedFilters() {
	const user: User | null = useStore($user);
	const extendedFilters: TreeItem[] | null = useStore(
		$nsiCurrentAvailableFilters,
	);
	const objectType: string | null = useStore($nsiCurrentObjectType);
	const checkedIds: Map<number, number[]> = useStore(
		$nsiExtendedFiltersCheckedIds,
	);
	const isLoading = useStore(getAvailableFiltersNSIFx.pending);

	const [openParametersIds, setOpenParametersIds] = useState<number[]>([]);

	const {
		parametersIds,
		getIsCheckboxChecked,
		getIsCheckboxIndeterminate,
		handleNodeClick,
	} = useCheckboxHandlers();

	function handleNodeToggle(node: TreeItem) {
		const { type, id } = node;

		if (type === 'parameter') {
			const newOpenParametersIds: number[] = toggleArrayValue(
				openParametersIds.slice(),
				id,
			);
			setOpenParametersIds(newOpenParametersIds);
		}
	}

	const renderTreeItem = useCallback(
		(treeItem: TreeItem) => {
			const isChecked: boolean = getIsCheckboxChecked(treeItem);
			const isIndeterminate: boolean = getIsCheckboxIndeterminate(treeItem);

			return (
				<div className={styles.tree_item}>
					<Checkbox
						className={clsx(styles.checkbox, {
							[styles.indeterminate]: isIndeterminate,
							[styles.checked]: isChecked,
						})}
						isChecked={isChecked}
						isIndeterminate={isIndeterminate}
						onChange={() => {}}
					/>
					<div className={styles.tree_label}>{treeItem.displayName}</div>
				</div>
			);
		},
		[getIsCheckboxChecked, getIsCheckboxIndeterminate],
	);

	const parametersLabel: string = useMemo(
		() => `Параметры ${objectType ? getParameterLabel(objectType) : ''}`,
		[objectType],
	);

	const tree: TreeItem[] = useMemo(() => {
		const parametersTree: TreeItem[] = [
			{
				id: 0,
				name: 'Параметры',
				displayName: parametersLabel,
				type: 'parameters',
				isOpen: true,
			},
		];
		parametersTree[0].renderFn = () => renderTreeItem(parametersTree[0]);

		const treeItems: TreeItem[] = extendedFilters
			? extendedFilters.map((treeItem: TreeItem) => {
					const isParameter = treeItem.type === 'parameter';
					const isOpen = isParameter && openParametersIds.includes(treeItem.id);

					return {
						...treeItem,
						isOpen,
						isLast: !isParameter,
						renderFn: () => renderTreeItem(treeItem),
					};
			  })
			: [];

		return [...parametersTree, ...treeItems];
	}, [extendedFilters, openParametersIds, parametersLabel, renderTreeItem]);

	function handleClose() {
		closeModal(RegisteredModals.TreeNSIExtendedFilters);
	}

	function handleConfirm() {
		setNSIExtendedFiltersCheckedIdsConfirmed(checkedIds);
		handleClose();
	}

	useEffect(() => {
		setOpenParametersIds(parametersIds);
	}, [parametersIds]);

	useEffect(() => {
		if (user) {
			getAvailableFiltersNSIFx({
				userId: user.preferredUsername,
				moduleName: ModuleName.UseExtendedFilters_getAvailableFiltersNSIFx,
			});
		}
	}, [user]);

	return {
		tree,
		isLoading,
		handleClose,
		handleConfirm,
		handleNodeToggle,
		handleNodeClick,
	};
}

export default useExtendedFilters;
