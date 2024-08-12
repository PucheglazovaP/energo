import { useCallback, useEffect, useRef, useState } from 'react';

import Modal from '../../Components/Modal';
import Table from '../../Components/Table';
import { useAppSelector } from '../../Hooks/Store/useAppSelector';
import { useHistory } from '../../Hooks/useHistory';
import usePagination from '../../Hooks/usePagination';
import { Pagination } from '../../Shared/types';
import { selectEnergyElement } from '../../Store/reducers/ConfiguratorSlice/configuratorSelectors';
import { selectContextMenuType } from '../../Store/reducers/ContextMenuSlice/contextMenuSelectors';
import { HistoryType } from '../../Store/reducers/HistorySlice/types';

import HistoryFilters from './HistoryFilters';
import { getElementTypeByMenuType, getElementTypeName } from './utils';
import styles from './History.module.scss';

export function History() {
	const [pagination, setPagination] = useState<Pagination>({
		rowCount: 10,
		pageNumber: 1,
	});

	const tableRef = useRef(null);

	const {
		closeHistoryModal,
		history,
		type,
		isLoading,
		getGeneralHistory,
		totalCount,
		filters,
	} = useHistory(styles);

	const energyElement = useAppSelector(selectEnergyElement);
	const contextMenuType = useAppSelector(selectContextMenuType);

	const handlePagination = useCallback(
		(newPagination: Pagination) => {
			if (isLoading) return;
			setPagination(newPagination);
			getGeneralHistory(newPagination);
		},
		[getGeneralHistory, isLoading],
	);

	const { onScroll } = usePagination(
		tableRef,
		pagination,
		totalCount,
		handlePagination,
	);

	const renderHeader = () => {
		if (energyElement && type === HistoryType.ELEMENT) {
			const elementType = getElementTypeByMenuType(contextMenuType);
			return (
				<div className={styles.header}>
					<span>История действий пользователя</span>
					<span className={styles.header__subheading}>
						{getElementTypeName(elementType)}: {energyElement.Name}
					</span>
				</div>
			);
		}
		return 'Общая история действий пользователей';
	};

	// TODO: Remove useEffect, use store instead
	useEffect(() => {
		setPagination({ rowCount: 10, pageNumber: 1 });
	}, [filters]);

	return (
		<Modal title={renderHeader()} onClose={closeHistoryModal}>
			{type === HistoryType.GENERAL && <HistoryFilters />}
			<Table
				header={history.header}
				rows={history.rows}
				isLoading={isLoading}
				onScroll={type === HistoryType.GENERAL ? onScroll : undefined}
				ref={tableRef}
			/>
		</Modal>
	);
}
