import {
	ChangeEvent,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';

import {
	CHANNEL,
	DEVICE,
	FORWARD_TREE,
	GROUP,
	REVERSE_TREE,
} from '../../Const';
import { selectSupportTooltipMode } from '../../Store/reducers/AppSlice/appSelectors';
import { positionOnElement } from '../../Store/reducers/ConfiguratorSlice/configuratorActions';
import {
	setChannelsInDevicesScrollAvailable,
	setDevicesFilterMode,
	setDevicesFilterString,
	setGroupsFilterMode,
	setGroupsFilterString,
	setNeedToScrollDevices,
	setScrollbarPositionChannelsInDevices,
} from '../../Store/reducers/ConfiguratorSlice/configuratorSlice';
import { removeParameterItems } from '../../Store/reducers/ParametersSlice/parametersSlice';
import { TreeType } from '../../Types';
import useAppDispatch from '../Store/useAppDispatch';
import { useAppSelector } from '../Store/useAppSelector';
import useDebounce from '../useDebounce';

export const useConfiguratorFilters = (treeType: TreeType) => {
	const dispatch = useAppDispatch();
	const isSupportTooltipMode = useAppSelector(selectSupportTooltipMode);
	const [currentSearchValue, setSearchCurrentValue] = useState('');
	const [debounceDelay, setDebounceDelay] = useState(1000);

	const handleSearchStringChange = useCallback(
		(e: ChangeEvent<HTMLInputElement>) => setSearchCurrentValue(e.target.value),
		[],
	);
	const { groupPagination, devicePagination } = useAppSelector(
		(state) => state.configuratorReducer,
	);
	const isForwardTree = useMemo(() => treeType === FORWARD_TREE, [treeType]);

	const currentPagination = useMemo(
		() => (isForwardTree ? groupPagination : devicePagination),
		[groupPagination, devicePagination, isForwardTree],
	);
	const filterMode = useMemo(
		() => currentPagination.filterMode,
		[currentPagination.filterMode],
	);
	const filterReducer = useAppSelector((state) => state.filtersReducer);
	const mode = useMemo(
		() =>
			isForwardTree
				? filterReducer.groupsActiveFilter
				: filterReducer.devicesActiveFilter,
		[
			filterReducer.groupsActiveFilter,
			filterReducer.devicesActiveFilter,
			isForwardTree,
		],
	);

	const debouncedValue = useDebounce(currentSearchValue, debounceDelay);
	const firstUpdate = useRef(true);

	// @ts-ignore
	const { setFilterString, setFilterMode } = useMemo((): Object => {
		switch (treeType) {
			case FORWARD_TREE:
				return {
					setFilterString: setGroupsFilterString,
					setFilterMode: setGroupsFilterMode,
				};
			case REVERSE_TREE:
				return {
					setFilterString: setDevicesFilterString,
					setFilterMode: setDevicesFilterMode,
				};
		}
	}, [treeType]);

	useEffect(() => {
		if (currentPagination.filterString === '') {
			setSearchCurrentValue('');
			if (treeType === FORWARD_TREE) {
				dispatch(removeParameterItems(GROUP));
			} else {
				dispatch(removeParameterItems(DEVICE));
				dispatch(removeParameterItems(CHANNEL));
			}
		}
	}, [currentPagination.filterString]);

	useEffect(() => {
		if (firstUpdate.current) {
			firstUpdate.current = false;
			return;
		}
		dispatch(setFilterString(debouncedValue));
		dispatch(setFilterMode(filterMode));

		dispatch(
			positionOnElement(
				debouncedValue,
				filterMode,
				isForwardTree ? GROUP : DEVICE,
				mode,
			),
		);
	}, [debouncedValue, filterMode]);

	useEffect(() => {
		if (devicePagination.scrollChannelsAvailable) {
			dispatch(setScrollbarPositionChannelsInDevices(Number(debouncedValue)));
			dispatch(setNeedToScrollDevices(true));
			dispatch(setChannelsInDevicesScrollAvailable(false));
		}
	}, [devicePagination.scrollChannelsAvailable]);

	useEffect(() => {
		if (String(currentPagination.filterString) !== currentSearchValue) {
			setDebounceDelay(0);
			setSearchCurrentValue(String(currentPagination.filterString));
			setTimeout(() => {
				setDebounceDelay(1000);
			}, 1000);
		}
	}, [currentPagination.filterString]);

	const radioButtonClickHandler = useCallback(
		(index: number) => () => {
			dispatch(setFilterMode(index + 1));
		},
		[],
	);

	const inputTooltip = useMemo(
		() =>
			filterMode === 2 &&
			isSupportTooltipMode &&
			'% - произвольное количество символов\n _ - один символ',
		[filterMode, isSupportTooltipMode],
	);

	return {
		handleSearchStringChange,
		radioButtonClickHandler,
		currentSearchValue,
		filterMode,
		inputTooltip,
	};
};
