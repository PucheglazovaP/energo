import { useCallback, useMemo, useRef, useState } from 'react';

import { vacantEntitiesTableAdapter } from '../Adapters/VacantEntities/vacantEntitiesTableAdapter';
import { SelectOption } from '../Components/Select/types';
import { Pagination } from '../Shared/types';
import { selectUser } from '../Store/reducers/AuthSlice/authSelectors';
import {
	VacantEntityParams,
	VacantEntityType,
} from '../Store/reducers/VacantEntitySlice/types';
import {
	clearVacantEntities,
	closeVacantEntitiesModal,
	getVacantEntitiesRpc,
	openVacantEntitiesModal,
	setVacantEntitiesSelectorData,
} from '../Store/reducers/VacantEntitySlice/VacantEntitiesActions';
import {
	selectActiveVacantEntity,
	selectIsVacantEntitiesLoading,
	selectIsVacantEntitiesOpen,
	selectVacantEntities,
	selectVacantEntitiesSelectorData,
	selectVacantEntitiesTotalCount,
} from '../Store/reducers/VacantEntitySlice/VacantEntitiesSelectors';

import useAppDispatch from './Store/useAppDispatch';
import { useAppSelector } from './Store/useAppSelector';
import usePagination from './usePagination';

const INITIAL_PAGINATION = {
	rowCount: 50,
	pageNumber: 1,
};
export const useVacantEntities = () => {
	const dispatch = useAppDispatch();
	const [pagination, setPagination] = useState<Pagination>(INITIAL_PAGINATION);
	const tableRef = useRef(null);
	const isVacantEntitiesLoading = useAppSelector(selectIsVacantEntitiesLoading);
	const isVacantEntitiesOpen = useAppSelector(selectIsVacantEntitiesOpen);
	const vacantEntitiesSelectorData = useAppSelector(
		selectVacantEntitiesSelectorData,
	);

	const vacantEntities = useAppSelector(selectVacantEntities);
	const activeVacantEntity = useAppSelector(selectActiveVacantEntity);
	const totalCount = useAppSelector(selectVacantEntitiesTotalCount);
	const userId = useAppSelector(selectUser)?.preferredUsername;

	const vacantEntitiesTableData = useMemo(() => {
		return vacantEntitiesTableAdapter(vacantEntities);
	}, [vacantEntities]);

	const openVacantEntities = useCallback(() => {
		dispatch(openVacantEntitiesModal());
	}, [dispatch]);

	const closeVacantEntities = useCallback(() => {
		dispatch(closeVacantEntitiesModal());
	}, [dispatch]);

	const getVacantEntities = useCallback(
		(pagination?: Pagination) => {
			const params: VacantEntityParams = {
				pageNumber: pagination?.pageNumber ?? 1,
				pageRowCount: pagination?.rowCount ?? 50,
				userId,
				vacantEntityType: activeVacantEntity,
			};
			dispatch(getVacantEntitiesRpc(params));
		},
		[dispatch, userId, activeVacantEntity],
	);

	const onClearVacantEntities = useCallback(() => {
		dispatch(clearVacantEntities());
	}, [dispatch]);

	const handleSelectedVacantEntityType = useCallback(
		(vacantEntitiesTypesList: SelectOption[]) => {
			dispatch(setVacantEntitiesSelectorData(vacantEntitiesTypesList));
			dispatch(clearVacantEntities());
			setPagination(INITIAL_PAGINATION);
			dispatch(
				getVacantEntitiesRpc({
					pageNumber: 1,
					pageRowCount: 50,
					userId,
					vacantEntityType: vacantEntitiesTypesList.find(
						(entityType) => entityType.isSelected,
					)?.value as VacantEntityType,
				}),
			);
		},
		[activeVacantEntity, userId],
	);

	const handlePagination = useCallback(
		(newPagination: Pagination) => {
			if (isVacantEntitiesLoading) return;
			setPagination(newPagination);
			getVacantEntities(newPagination);
		},
		[getVacantEntities, isVacantEntitiesLoading],
	);

	const handleCloseModal = useCallback(() => {
		closeVacantEntities();
		dispatch(clearVacantEntities());
	}, [closeVacantEntities, clearVacantEntities]);

	const { onScroll } = usePagination(
		tableRef,
		pagination,
		totalCount,
		handlePagination,
	);

	return {
		isVacantEntitiesLoading,
		isVacantEntitiesOpen,
		openVacantEntities,
		closeVacantEntities,
		getVacantEntities,
		totalCount,
		vacantEntitiesTableData,
		clearVacantEntities: onClearVacantEntities,
		handleSelectedVacantEntityType,
		vacantEntitiesSelectorData,
		handleCloseModal,
		onScroll,
		tableRef,
	};
};
