import { useCallback, useMemo } from 'react';
import { Button } from '@evraz/ui-kit';
import { useStore } from 'effector-react';

import { Close } from '../../Icons';
import {
	$nsiAvailableFilters,
	$nsiExtendedFiltersCheckedIdsConfirmed,
} from '../../Models/NSITreeDevices';
import {
	clearNSIParameterFilter,
	clearNSIParameterFilters,
} from '../../Models/NSITreeDevices/events';
import { AvailableFiltersByObjectTypes } from '../../Shared/types';
import { TreeItem } from '../../UI/Tree/types';

import styles from './ModalNSITreeExtendedFiltersChips.module.css';

function useExtendedFiltersChips() {
	const availableFilters: AvailableFiltersByObjectTypes =
		useStore($nsiAvailableFilters);
	const checkedIds = useStore($nsiExtendedFiltersCheckedIdsConfirmed);

	const treeItems: TreeItem[] = useMemo(
		() => Array.from(Object.values(availableFilters)).flat(),
		[availableFilters],
	);

	const checkedParameters = useMemo(
		() =>
			treeItems.filter(({ id, type }) => {
				if (type === 'parameter') {
					const checkedValues = checkedIds.get(id);

					if (checkedValues && checkedValues.length > 0) {
						return true;
					}
				}
				return false;
			}),
		[treeItems, checkedIds],
	);

	const getValueName = useCallback(
		(valueId: number) => {
			return (
				treeItems.find(({ id, type }) => id === valueId && type === 'value')
					?.displayName || ''
			);
		},
		[treeItems],
	);

	const handleClearParameterFilters = (parameterId: number) => () => {
		clearNSIParameterFilter(parameterId);
	};

	function handleAllFiltersClear() {
		clearNSIParameterFilters();
	}

	const chips = useMemo(
		() =>
			checkedParameters.map((parameter: TreeItem) => {
				const { id, displayName } = parameter;
				const checkedValues = checkedIds.get(id);
				let valuesLabel = '';

				if (checkedValues) {
					if (checkedValues.length === 1) {
						valuesLabel = getValueName(checkedValues[0]);
					} else {
						valuesLabel = `${checkedValues.length} зн.`;
					}
				}

				return (
					<div className={styles.chip} key={id}>
						<div
							className={styles.chip_label}
						>{`${displayName}: ${valuesLabel}`}</div>
						<Button
							className={styles.delete_button}
							onClick={handleClearParameterFilters(id)}
						>
							<Close className={styles.close_icon} />
						</Button>
					</div>
				);
			}),
		[checkedIds, checkedParameters, getValueName],
	);

	const isCommonChipShown: boolean = chips.length > 0;

	return { chips, isCommonChipShown, handleAllFiltersClear };
}

export default useExtendedFiltersChips;
