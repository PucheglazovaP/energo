import { useCallback, useMemo } from 'react';
import { useStore } from 'effector-react';

import {
	$nsiCurrentAvailableFilters,
	$nsiExtendedFiltersCheckedIds,
} from '../../Models/NSITreeDevices';
import { setNSIExtendedFiltersParameterCheckedIds } from '../../Models/NSITreeDevices/events';
import { TreeItem } from '../../UI/Tree/types';
import { toggleArrayValue } from '../../Utils/toggleArrayValue';

function useCheckboxHandlers() {
	const extendedFilters: TreeItem[] | null = useStore(
		$nsiCurrentAvailableFilters,
	);
	const checkedIds: Map<number, number[]> = useStore(
		$nsiExtendedFiltersCheckedIds,
	);

	const parametersIds: number[] = useMemo(
		() =>
			extendedFilters
				? extendedFilters
						.filter(({ type }) => type === 'parameter')
						.map(({ id }) => id)
				: [],
		[extendedFilters],
	);

	const allValuesIds: number[] = useMemo(
		() =>
			extendedFilters
				? extendedFilters
						.filter(({ type }) => type === 'value')
						.map(({ id }) => id)
				: [],
		[extendedFilters],
	);

	const allCheckedValuesIds: number[] = useMemo(() => {
		let checkedValues: number[] = [];

		for (let [, values] of checkedIds) {
			checkedValues = [...checkedValues, ...values];
		}

		return checkedValues;
	}, [checkedIds]);

	const valuesIds: Map<number, number[]> = useMemo(() => {
		const idsMap: Map<number, number[]> = new Map();

		if (extendedFilters) {
			for (let parameterId of parametersIds) {
				const currentValuesIds: number[] = extendedFilters
					.filter(({ parentId }) => parentId === parameterId)
					.map(({ id }) => id);
				idsMap.set(parameterId, currentValuesIds);
			}
		}

		return idsMap;
	}, [extendedFilters, parametersIds]);

	const isCommonCheckboxChecked: boolean = useMemo(() => {
		for (let [key, ids] of checkedIds) {
			const values = valuesIds.get(key);
			if (!(values && values.length === ids.length && ids.length > 0)) {
				return false;
			}
		}

		return true;
	}, [checkedIds, valuesIds]);

	const isCommonCheckboxIndeterminate: boolean = useMemo(() => {
		return (
			allCheckedValuesIds.length < allValuesIds.length &&
			allCheckedValuesIds.length > 0
		);
	}, [allCheckedValuesIds, allValuesIds]);

	const getIsParameterCheckboxChecked = useCallback(
		(parameterId: number): boolean => {
			const parameterCheckedIds = checkedIds.get(parameterId);
			const parameterValuesIds = valuesIds.get(parameterId);

			if (parameterCheckedIds && parameterValuesIds) {
				const isChecked: boolean =
					parameterValuesIds.length > 0 &&
					parameterCheckedIds.length === parameterValuesIds.length;

				return isChecked;
			}

			return false;
		},
		[checkedIds, valuesIds],
	);
	const getIsParameterCheckboxIndeterminate = useCallback(
		(parameterId: number): boolean => {
			const parameterCheckedIds = checkedIds.get(parameterId);
			const parameterValuesIds = valuesIds.get(parameterId);

			if (parameterCheckedIds && parameterValuesIds) {
				const isIndeterminate: boolean =
					parameterCheckedIds.length > 0 &&
					parameterCheckedIds.length < parameterValuesIds.length;

				return isIndeterminate;
			}

			return false;
		},
		[checkedIds, valuesIds],
	);

	const getIsCheckboxChecked = useCallback(
		(treeItem: TreeItem): boolean => {
			const { type, id, parentId } = treeItem;
			const isParameter: boolean = type === 'parameter';
			const isParameters: boolean = type === 'parameters';

			if (isParameters) {
				return isCommonCheckboxChecked;
			}

			if (isParameter) {
				return getIsParameterCheckboxChecked(id);
			}

			if (parentId) {
				const parameterCheckedIds = checkedIds.get(parentId);

				if (parameterCheckedIds) {
					return parameterCheckedIds?.includes(id);
				}
			}

			return false;
		},
		[getIsParameterCheckboxChecked, checkedIds, isCommonCheckboxChecked],
	);
	const getIsCheckboxIndeterminate = useCallback(
		(treeItem: TreeItem): boolean => {
			const { type, id } = treeItem;
			const isParameter: boolean = type === 'parameter';
			const isParameters: boolean = type === 'parameters';

			if (isParameters) {
				return isCommonCheckboxIndeterminate;
			}

			if (isParameter) {
				return getIsParameterCheckboxIndeterminate(id);
			}

			return false;
		},
		[getIsParameterCheckboxIndeterminate, isCommonCheckboxIndeterminate],
	);

	function handleCommonCheckboxChange() {
		if (isCommonCheckboxIndeterminate || !isCommonCheckboxChecked) {
			for (let parameterId of parametersIds) {
				const parameterValuesIds = valuesIds.get(parameterId);

				if (parameterValuesIds) {
					setNSIExtendedFiltersParameterCheckedIds({
						parameterId,
						checkedIds: parameterValuesIds,
					});
				}
			}
		} else {
			for (let parameterId of parametersIds) {
				setNSIExtendedFiltersParameterCheckedIds({
					parameterId,
					checkedIds: [],
				});
			}
		}
	}

	function handleParameterCheckboxChange(parameterId: number) {
		const parameterCheckedIds = checkedIds.get(parameterId);
		const parameterValuesIds = valuesIds.get(parameterId);

		if (parameterCheckedIds && parameterValuesIds) {
			const isChecked: boolean = getIsParameterCheckboxChecked(parameterId);
			const isIndeterminate: boolean =
				getIsParameterCheckboxIndeterminate(parameterId);

			if (isIndeterminate || !isChecked) {
				setNSIExtendedFiltersParameterCheckedIds({
					parameterId,
					checkedIds: parameterValuesIds,
				});
			} else {
				setNSIExtendedFiltersParameterCheckedIds({
					parameterId,
					checkedIds: [],
				});
			}
		}
	}

	function handleValueCheckboxChange(parameterId: number, valueId: number) {
		const parameterCheckedIds = checkedIds.get(parameterId);
		const parameterValuesIds = valuesIds.get(parameterId);

		if (parameterCheckedIds && parameterValuesIds) {
			const newCheckedIds: number[] = toggleArrayValue(
				parameterCheckedIds.slice(),
				valueId,
			);
			setNSIExtendedFiltersParameterCheckedIds({
				parameterId,
				checkedIds: newCheckedIds,
			});
		}
	}

	function handleNodeClick(node: TreeItem) {
		const { type, id, parentId } = node;

		if (type === 'parameters') {
			handleCommonCheckboxChange();
		} else if (type === 'parameter') {
			handleParameterCheckboxChange(id);
		} else {
			if (parentId) {
				handleValueCheckboxChange(parentId, id);
			}
		}
	}

	return {
		parametersIds,
		getIsCheckboxChecked,
		getIsCheckboxIndeterminate,
		handleNodeClick,
	};
}

export default useCheckboxHandlers;
