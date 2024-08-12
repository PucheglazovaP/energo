/* global CSSModuleClasses */
import { useCallback, useMemo } from 'react';
import { add, format } from 'date-fns';

import { elementHistoryAdapter } from '../Adapters/History/elementHistoryAdapter';
import { generalHistoryAdapter } from '../Adapters/History/generalHistoryAdapter';
import { SelectOption } from '../Components/Select/types';
import { Pagination } from '../Shared/types';
import { selectUser } from '../Store/reducers/AuthSlice/authSelectors';
import {
	clearHistory,
	closeHistoryModal,
	getElementHistoryRpc,
	getGeneralHistoryRpc,
	openHistoryModal,
	setHistoryDates,
	setHistoryDefaultFilters,
	setHistoryType,
	setHistoryTypes,
	toggleCollapseHistoryItem,
} from '../Store/reducers/HistorySlice/HistoryActions';
import {
	selectHistory,
	selectHistoryFilters,
	selectHistoryIsLoading,
	selectHistoryTotalCount,
	selectHistoryType,
	selectIsModalOpen,
} from '../Store/reducers/HistorySlice/HistorySelectors';
import {
	HistoryElementParams,
	HistoryElementType,
	HistoryGeneralParams,
	HistoryType,
} from '../Store/reducers/HistorySlice/types';

import useAppDispatch from './Store/useAppDispatch';
import { useAppSelector } from './Store/useAppSelector';

export const useHistory = (styles?: CSSModuleClasses) => {
	const dispatch = useAppDispatch();
	const isHistoryOpen = useAppSelector(selectIsModalOpen);
	const history = useAppSelector(selectHistory);
	const historyIsLoading = useAppSelector(selectHistoryIsLoading);
	const historyFilters = useAppSelector(selectHistoryFilters);
	const historyType = useAppSelector(selectHistoryType);
	const historyTotalCount = useAppSelector(selectHistoryTotalCount);
	const userId = useAppSelector(selectUser)?.preferredUsername;

	const onHistoryCollapse = useCallback(
		(id: string | number) => {
			dispatch(toggleCollapseHistoryItem(id));
		},
		[dispatch],
	);

	const historyData = useMemo(() => {
		if (historyType === HistoryType.GENERAL) {
			return generalHistoryAdapter(history, onHistoryCollapse, styles ?? {});
		} else {
			return elementHistoryAdapter(history, onHistoryCollapse, styles ?? {});
		}
	}, [history, onHistoryCollapse, historyType]);

	const handleClearHistory = useCallback(() => {
		dispatch(clearHistory());
	}, [dispatch]);

	const isFilterTypeSelected = useCallback(
		(elementType: HistoryElementType) => {
			const type = historyFilters.types.find((t) => t.value === elementType);
			if (type) {
				return type.isSelected;
			}
			return false;
		},
		[historyFilters.types],
	);

	const getGeneralHistory = useCallback(
		(pagination?: Pagination) => {
			const params: HistoryGeneralParams = {
				fromDate: format(historyFilters.dates[0], 'yyyy-MM-dd HH:mm:ss'),
				toDate: format(historyFilters.dates[1], 'yyyy-MM-dd HH:mm:ss'),
				isGroup: Number(isFilterTypeSelected(HistoryElementType.GROUP)),
				isChannel: Number(isFilterTypeSelected(HistoryElementType.CHANNEL)),
				isDevice: Number(isFilterTypeSelected(HistoryElementType.DEVICE)),
				pageRowCount: pagination?.rowCount ?? 10,
				pageNumber: pagination?.pageNumber ?? 1,
				userId,
			};
			dispatch(getGeneralHistoryRpc(params));
		},
		[dispatch, historyFilters, userId],
	);

	const getElementHistory = useCallback(
		(elementType: HistoryElementType, id: number) => {
			let path: string = '';
			if (elementType === HistoryElementType.CHANNEL) {
				path = '[appl_tags].[Get_HistoryOneChannel]';
			}
			if (elementType === HistoryElementType.DEVICE) {
				path = '[appl_tags].[Get_HistoryOneDevice]';
			}
			if (elementType === HistoryElementType.GROUP) {
				path = '[appl_tags].[Get_HistoryOneGroup]';
			}
			const params: HistoryElementParams = {
				path,
				id,
				fromDate: format(add(new Date(), { weeks: -1 }), 'yyyy-MM-dd HH:mm:ss'),
				toDate: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
				userId,
			};
			dispatch(getElementHistoryRpc(params));
		},
		[dispatch, userId],
	);

	const resetHistoryFilters = useCallback(() => {
		dispatch(setHistoryDefaultFilters());
	}, [dispatch]);

	const handleOpenHistoryModal = useCallback(() => {
		dispatch(openHistoryModal());
	}, [dispatch]);

	const handleCloseHistoryModal = useCallback(() => {
		handleClearHistory();
		resetHistoryFilters();
		dispatch(closeHistoryModal());
	}, [dispatch, resetHistoryFilters, handleClearHistory]);

	const handleHistoryType = useCallback(
		(type: HistoryType) => {
			dispatch(setHistoryType(type));
		},
		[dispatch],
	);

	const handleHistoryDates = useCallback(
		(dates: Date[]) => {
			dispatch(setHistoryDates(dates));
		},
		[dispatch],
	);

	const handleHistoryTypes = useCallback(
		(options: SelectOption[]) => {
			dispatch(setHistoryTypes(options));
		},
		[dispatch],
	);

	return {
		openHistoryModal: handleOpenHistoryModal,
		closeHistoryModal: handleCloseHistoryModal,
		isHistoryOpen,
		history: historyData,
		isLoading: historyIsLoading,
		onCollapse: onHistoryCollapse,
		getGeneralHistory,
		getElementHistory,
		filters: historyFilters,
		type: historyType,
		setHistoryType: handleHistoryType,
		setHistoryTypes: handleHistoryTypes,
		setHistoryDates: handleHistoryDates,
		clearHistory: handleClearHistory,
		totalCount: historyTotalCount,
	};
};
